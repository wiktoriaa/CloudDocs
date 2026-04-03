package com.example.cloudstorebackend.storage.api;

import com.example.cloudstorebackend.storage.StorageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/storage")
public class StorageController {

    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(path = "/upload", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public void uploadFile(@ModelAttribute UploadFileRequest request) {
        storageService.saveFile(request.getFileName(), request.getUsername(), request.getDocument());
    }
}


