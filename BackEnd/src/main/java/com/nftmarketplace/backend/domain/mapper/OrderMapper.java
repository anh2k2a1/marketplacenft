package com.nftmarketplace.backend.domain.mapper;

import com.nftmarketplace.backend.domain.Listing;
import com.nftmarketplace.backend.domain.Nft;
import com.nftmarketplace.backend.domain.Order;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.OrderDTO;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {
    public Order toEntity(OrderDTO dto, Listing listing, User buyer) {
        Order o = new Order();
        o.setId(dto.getId());
        o.setListing(listing);
        o.setBuyer(buyer);
        o.setPrice(dto.getPrice());
        if (dto.getStatus() != null)
            o.setStatus(Order.Status.valueOf(dto.getStatus()));
        // createdAt và completedAt set ở service
        return o;
    }

    public OrderDTO toDto(Order o) {
        OrderDTO dto = new OrderDTO();
        dto.setId(o.getId());
        dto.setPrice(o.getPrice());
        dto.setStatus(o.getStatus() != null ? o.getStatus().name() : null);
        dto.setCreatedAt(o.getCreatedAt());
        dto.setCompletedAt(o.getCompletedAt());
        // lấy thông tin NFT qua listing
        if (o.getListing() != null && o.getListing().getNft() != null) {
            dto.setListingId(o.getListing().getId());
            dto.setNftName(o.getListing().getNft().getName());
            dto.setImageUrl(o.getListing().getNft().getImageUrl());
        }
        if (o.getBuyer() != null) {
            dto.setBuyerWallet(o.getBuyer().getWalletAddress());
        }
        return dto;
    }
}
