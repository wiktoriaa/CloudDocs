package com.example.cloudstorebackend.storage.utils;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "cloud-store.storage")
@Validated
public record StorageProperties(
        @NotBlank String uploadDir
) {}
