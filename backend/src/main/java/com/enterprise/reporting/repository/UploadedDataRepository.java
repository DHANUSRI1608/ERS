package com.enterprise.reporting.repository;

import com.enterprise.reporting.model.UploadedData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UploadedDataRepository extends JpaRepository<UploadedData, Long> {
}
