package com.example.cloudstorebackend.storage.utils;

import java.io.IOException;

@FunctionalInterface
public interface IOOperation<T> {
    T execute() throws IOException;
}
