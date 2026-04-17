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
}
