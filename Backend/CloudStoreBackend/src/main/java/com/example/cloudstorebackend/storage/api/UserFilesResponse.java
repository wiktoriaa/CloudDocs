package com.example.cloudstorebackend.storage.api;

import java.util.List;

public record UserFilesResponse(String username, List<String> files) {
}
