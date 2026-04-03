package com.example.cloudstorebackend.storage.api;

import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
public class UploadFileRequest {
    private String fileName;
    private String username;
    private MultipartFile document;
}
