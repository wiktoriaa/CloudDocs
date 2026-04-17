package com.example.cloudstorebackend.storage;

import com.example.cloudstorebackend.storage.utils.IOHelper;
import com.example.cloudstorebackend.storage.utils.StorageException;
import com.example.cloudstorebackend.storage.utils.StorageProperties;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;

@Service
public class StorageService {

    private static final Logger log = LoggerFactory.getLogger(StorageService.class);

    private final Path rootDir;

    public StorageService(StorageProperties storageProperties) {
        this.rootDir = Paths.get(storageProperties.uploadDir());
    }

    @PostConstruct
    public void init() {
        IOHelper.tryIO("STORAGE_INIT_FAILED",
                "Cannot create upload directory: " + rootDir.toAbsolutePath(),
                () -> Files.createDirectories(rootDir));
        log.info("Upload directory ready: path={}", rootDir.toAbsolutePath());
    }

    public void saveFile(String username, MultipartFile document) {
        if (document == null || document.isEmpty()) {
            throw new StorageException("STORAGE_EMPTY_FILE", "Cannot save empty file");
        }

        String fileName = sanitizeFilename(document.getOriginalFilename());
        Path userDir = resolveUserDir(username);
        createDirectories(userDir, username);

        Path destination = userDir.resolve(fileName);
        log.info("Saving file to disk: fileName={}, username={}, destination={}",
                fileName, username, destination.toAbsolutePath());

        IOHelper.tryIO("STORAGE_WRITE_FAILED",
                "Failed to write file to disk: fileName=%s, username=%s".formatted(fileName, username),
                () -> {
                    try (InputStream inputStream = document.getInputStream()) {
                        Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
                    }
                });
        log.info("File saved successfully: fileName={}, username={}, sizeBytes={}",
                fileName, username, document.getSize());
    }

    public List<String> getFiles(String username) {
        Path userDir = resolveUserDir(username);
        log.info("Listing files for user: username={}, path={}", username, userDir.toAbsolutePath());

        if (!Files.exists(userDir)) {
            log.info("User directory does not exist, returning empty list: username={}", username);
            return Collections.emptyList();
        }

        List<String> files = IOHelper.tryIO("STORAGE_LIST_FAILED",
                "Failed to list files for user: username=%s".formatted(username),
                () -> {
                    try (var stream = Files.list(userDir)) {
                        return stream.filter(Files::isRegularFile)
                                .map(path -> path.getFileName().toString())
                                .toList();
                    }
                });
        log.info("Found files for user: username={}, count={}", username, files.size());
        return files;
    }

    public byte[] downloadFile(String username, String filename) {
        String safeFilename = sanitizeFilename(filename);
        Path filePath = resolveUserDir(username).resolve(safeFilename);
        log.info("Downloading file: username={}, filename={}, path={}",
                username, safeFilename, filePath.toAbsolutePath());

        if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
            throw new StorageException("STORAGE_FILE_NOT_FOUND",
                    "File not found: username=%s, filename=%s".formatted(username, safeFilename));
        }

        byte[] fileContent = IOHelper.tryIO("STORAGE_READ_FAILED",
                "Failed to read file: username=%s, filename=%s".formatted(username, safeFilename),
                () -> Files.readAllBytes(filePath));
        log.info("File downloaded successfully: username={}, filename={}, sizeBytes={}",
                username, safeFilename, fileContent.length);
        return fileContent;
    }

    private Path resolveUserDir(String username) {
        return rootDir.resolve(Paths.get(username).getFileName());
    }

    private void createDirectories(Path dir, String username) {
        IOHelper.tryIO("STORAGE_DIR_CREATE_FAILED",
                "Cannot create user directory: username=%s, path=%s".formatted(username, dir),
                () -> Files.createDirectories(dir));
    }

    private String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            throw new StorageException("STORAGE_INVALID_FILENAME", "Filename must not be blank");
        }
        return Paths.get(filename).getFileName().toString();
    }
}
