package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.Category;
import com.nftmarketplace.backend.domain.dto.CategoryDTO;
import com.nftmarketplace.backend.domain.mapper.CategoryMapper;
import com.nftmarketplace.backend.repository.jpa.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repo;
    private final CategoryMapper mapper;

    public List<CategoryDTO> getAll() {
        return repo.findAll().stream().map(mapper::toDto).toList();
    }
    public CategoryDTO get(Long id) {
        return repo.findById(id).map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }
    public CategoryDTO create(CategoryDTO dto) {
        return mapper.toDto(repo.save(mapper.toEntity(dto)));
    }
    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category c = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        c.setName(dto.getName());
        return mapper.toDto(repo.save(c));
    }
    public void delete(Long id) { repo.deleteById(id); }
}

