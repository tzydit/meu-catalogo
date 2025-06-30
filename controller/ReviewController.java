package com.example.demo.controller;

import com.example.demo.model.Comment;
import com.example.demo.model.Review;
import com.example.demo.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ...existing code...

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{reviewId}/comments/{commentId}")
    @Operation(summary = "Editar comentário de uma avaliação", description = "Permite ao autor editar seu comentário em uma avaliação.")
    public ResponseEntity<Review> updateComment(@PathVariable String reviewId, @PathVariable String commentId, @RequestBody Comment comment, Authentication authentication) {
        String username = authentication.getName();
        Review updated = reviewService.updateComment(reviewId, commentId, comment.getTexto(), username);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{reviewId}/comments/{commentId}")
    @Operation(summary = "Excluir comentário de uma avaliação", description = "Permite ao autor ou um ADMIN excluir um comentário de uma avaliação.")
    public ResponseEntity<Review> deleteComment(@PathVariable String reviewId, @PathVariable String commentId, Authentication authentication) {
        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Review updated = reviewService.deleteComment(reviewId, commentId, username, isAdmin);
        return ResponseEntity.ok(updated);
    }
}