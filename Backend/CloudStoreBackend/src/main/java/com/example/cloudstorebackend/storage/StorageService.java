package com.example.cloudstorebackend.storage;

import com.example.cloudstorebackend.storage.utils.StorageException;
import com.example.cloudstorebackend.storage.utils.StorageProperties;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    private final StorageProperties storageProperties;

    public StorageService(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @PostConstruct
    public void init() {
        Path uploadDir = Paths.get(storageProperties.uploadDir());
        if (!Files.exists(uploadDir)) {
            try {
                Files.createDirectories(uploadDir);
                log.info("Created upload directory: path={}", uploadDir.toAbsolutePath());
            } catch (IOException e) {
                throw new StorageException(
                        "STORAGE_INIT_FAILED",
                        "Cannot create upload directory: " + uploadDir.toAbsolutePath(),
                        e
                );
            }
        }
    }

    public void saveFile(String username, MultipartFile document) {
        if (document == null || document.isEmpty()) {
            throw new StorageException("STORAGE_EMPTY_FILE",
                    "Cannot save empty file");
        }

        String fileName = document.getOriginalFilename();
        Path userDir = Paths.get(storageProperties.uploadDir(), username);

        try {
            Files.createDirectories(userDir);
        } catch (IOException e) {
            throw new StorageException("STORAGE_DIR_CREATE_FAILED",
                    "Cannot create user directory: username=%s, path=%s".formatted(username, userDir), e);
        }

        Path destination = userDir.resolve(Paths.get(fileName).getFileName());

        log.info("Saving file to disk: fileName={}, username={}, destination={}",
                fileName, username, destination.toAbsolutePath());

        try (InputStream inputStream = document.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            log.info("File saved successfully: fileName={}, username={}, sizeBytes={}",
                    fileName, username, document.getSize());
        } catch (IOException e) {
            throw new StorageException("STORAGE_WRITE_FAILED",
                    "Failed to write file to disk: fileName=%s, username=%s, destination=%s"
                            .formatted(fileName, username, destination),
                    e);
        }
    }

    public List<String> getFiles(String username) {
        Path userDir = Paths.get(storageProperties.uploadDir(), username);
        log.info("Listing files for user: username={}, path={}", username, userDir.toAbsolutePath());

        if (!Files.exists(userDir)) {
            log.info("User directory does not exist, returning empty list: username={}", username);
            return Collections.emptyList();
        }

        try (var stream = Files.list(userDir)) {
            List<String> files = stream
                    .filter(Files::isRegularFile)
                    .map(path -> path.getFileName().toString())
                    .toList();
            log.info("Found files for user: username={}, count={}", username, files.size());
            return files;
        } catch (IOException e) {
            throw new StorageException("STORAGE_LIST_FAILED",
                    "Failed to list files for user: username=%s, path=%s".formatted(username, userDir), e);
        }
    }

    public Object downloadFile(String username, String filename) {
        Path filePath = Paths.get(storageProperties.uploadDir(), username, filename);
        log.info("Downloading file: username={}, filename={}, path={}",
                username, filename, filePath.toAbsolutePath());

        if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
            throw new StorageException("STORAGE_FILE_NOT_FOUND",
                    "File not found: username=%s, filename=%s".formatted(username, filename));
        }

        try {
            byte[] fileContent = Files.readAllBytes(filePath);
            log.info("File downloaded successfully: username={}, filename={}, sizeBytes={}",
                    username, filename, fileContent.length);
            return fileContent;
        } catch (IOException e) {
            throw new StorageException("STORAGE_READ_FAILED",
                    "Failed to read file: username=%s, filename=%s".formatted(username, filename), e);
        }
    }
}
