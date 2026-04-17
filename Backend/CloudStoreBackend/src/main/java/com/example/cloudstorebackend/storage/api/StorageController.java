package com.example.cloudstorebackend.storage.api;

import com.example.cloudstorebackend.storage.StorageService;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/storage")
public class StorageController {

    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(path = "/upload", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public void uploadFile(@AuthenticationPrincipal FirebaseToken firebaseToken,
                           @RequestParam("document") MultipartFile document) {
        String username = firebaseToken.getEmail();
        storageService.saveFile(username, document);
    }

    @GetMapping("/files")
    public ResponseEntity<UserFilesResponse> getFiles(@AuthenticationPrincipal FirebaseToken firebaseToken) {
        String username = firebaseToken.getEmail();
        var files = storageService.getFiles(username);
        return ResponseEntity.ok(new UserFilesResponse(username, files));
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<byte[]> downloadFile(@AuthenticationPrincipal FirebaseToken firebaseToken,
                                               @PathVariable String filename) {
        String username = firebaseToken.getEmail();
        var fileContent = storageService.downloadFile(username, filename);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .body(fileContent);
    }
}


