package com.example.cloudstorebackend.storage.api;

import com.example.cloudstorebackend.storage.StorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/storage")
public class StorageController {

    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(path = "/upload", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public void uploadFile(@ModelAttribute UploadFileRequest request) {
        storageService.saveFile(request.getUsername(), request.getDocument());
    }

    @GetMapping("/files")
    public ResponseEntity<UserFilesResponse> getFiles(@RequestParam String username) {
        var files = storageService.getFiles(username);
        return ResponseEntity.ok(new UserFilesResponse(username, files));
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Object> downloadFile(@RequestParam String username, @PathVariable String filename) {
        var fileContent = storageService.downloadFile(username, filename);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .body(fileContent);
    }
}


