package com.example.cloudstorebackend.storage.utils;

import java.io.IOException;

@FunctionalInterface
public interface IORunnable {
    void execute() throws IOException;
}
