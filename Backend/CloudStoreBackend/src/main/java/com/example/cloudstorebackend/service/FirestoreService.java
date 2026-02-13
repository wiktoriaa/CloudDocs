package com.example.cloudstorebackend.service;

import com.google.cloud.firestore.Firestore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirestoreService {
    private final Firestore firestore;

    @Autowired
    public FirestoreService(Firestore firestore) {
        this.firestore = firestore;
    }

    public void addDocument() throws ExecutionException, InterruptedException {
        Map<String, String> docData = new HashMap<>();
        docData.put("name", "Testowy Dokument");
        docData.put("description", "To jest opis.");

        firestore.collection("moja_kolekcja").document("moj_dokument_id").set(docData).get();
        System.out.println("Dokument dodany do Firestore!");
    }
}
