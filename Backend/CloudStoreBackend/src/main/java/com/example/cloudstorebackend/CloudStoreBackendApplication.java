package com.example.cloudstorebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CloudStoreBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CloudStoreBackendApplication.class, args);
    }

}
