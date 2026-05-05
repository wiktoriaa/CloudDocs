package com.example.cloudstorebackend.storage.api;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserFile {
    String fileName;
    String fileType;
    String downloadUrl;
}
