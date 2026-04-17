package com.example.cloudstorebackend.storage.api;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadFileRequest {
    private String username;
    private MultipartFile document;
}
