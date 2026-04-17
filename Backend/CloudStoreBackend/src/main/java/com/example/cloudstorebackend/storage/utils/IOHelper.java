package com.example.cloudstorebackend.storage.utils;

public final class IOHelper {

    private IOHelper() {
    }

    public static <T> T tryIO(String errorCode, String errorMessage, IOOperation<T> operation) {
        try {
            return operation.execute();
        } catch (java.io.IOException e) {
            throw new StorageException(errorCode, errorMessage, e);
        }
    }

    public static void tryIO(String errorCode, String errorMessage, IORunnable operation) {
        try {
            operation.execute();
        } catch (java.io.IOException e) {
            throw new StorageException(errorCode, errorMessage, e);
        }
    }
}
