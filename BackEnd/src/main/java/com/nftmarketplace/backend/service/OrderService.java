package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.Listing;
import com.nftmarketplace.backend.domain.Order;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.OrderDTO;
import com.nftmarketplace.backend.domain.mapper.OrderMapper;
import com.nftmarketplace.backend.repository.jpa.ListingRepository;
import com.nftmarketplace.backend.repository.jpa.OrderRepository;
import com.nftmarketplace.backend.repository.jpa.UserRepository;
import com.nftmarketplace.backend.repository.query.OrderQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final OrderQueryRepository orderQueryRepository;

    // CREATE

    public OrderDTO create(OrderDTO dto) {
        Listing listing = listingRepository.findById(dto.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        User buyer = userRepository.findByWalletAddress(dto.getBuyerWallet())
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        Order order = orderMapper.toEntity(dto, listing, buyer);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(Order.Status.pending);

        Order saved = orderRepository.save(order);
        return orderMapper.toDto(saved);
    }

    // GET ALL
    public List<OrderDTO> getAll() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public OrderDTO getById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderMapper.toDto(order);
    }

    // UPDATE
    public OrderDTO update(Long id, OrderDTO dto) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Listing listing = listingRepository.findById(dto.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        User buyer = userRepository.findByWalletAddress(dto.getBuyerWallet())
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        order.setListing(listing);
        order.setBuyer(buyer);
        order.setPrice(dto.getPrice());
        order.setStatus(Order.Status.valueOf(dto.getStatus()));
        order.setCreatedAt(order.getCreatedAt()); // giữ nguyên thời điểm tạo

        //  tự động set completedAt khi trạng thái là completed
        if (order.getStatus() == Order.Status.completed) {
            order.setCompletedAt(LocalDateTime.now());
        } else {
            order.setCompletedAt(null);
        }

        Order saved = orderRepository.save(order);
        return orderMapper.toDto(saved);
    }

    // DELETE
    public void delete(Long id) {
        if (!orderRepository.existsById(id))
            throw new RuntimeException("Order not found");
        orderRepository.deleteById(id);
    }
    public List<OrderDTO> filter(String buyerWallet,
                                        String status,
                                        LocalDateTime from,
                                        LocalDateTime to,
                                        Double minPrice,
                                        Double maxPrice) {
        return orderQueryRepository.filter(buyerWallet, status, from, to, minPrice, maxPrice)
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }
}

