package br.com.meli.reviewservice.service;

import br.com.meli.reviewservice.entity.Comment;
import br.com.meli.reviewservice.entity.Review;
import br.com.meli.reviewservice.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // ...existing methods...

    public Review updateComment(String reviewId, String commentId, String texto, String username) {
        Review review = getReviewById(reviewId);
        if (review == null || review.getComentarios() == null) throw new RuntimeException("Review ou comentário não encontrado");
        for (Comment c : review.getComentarios()) {
            if (c.getId().equals(commentId)) {
                if (!c.getAutor().equals(username)) throw new RuntimeException("Apenas o autor pode editar o comentário");
                c.setTexto(texto);
                return reviewRepository.save(review);
            }
        }
        throw new RuntimeException("Comentário não encontrado");
    }

    public Review deleteComment(String reviewId, String commentId, String username, boolean isAdmin) {
        Review review = getReviewById(reviewId);
        if (review == null || review.getComentarios() == null) throw new RuntimeException("Review ou comentário não encontrado");
        Iterator<Comment> it = review.getComentarios().iterator();
        while (it.hasNext()) {
            Comment c = it.next();
            if (c.getId().equals(commentId)) {
                if (!c.getAutor().equals(username) && !isAdmin) throw new RuntimeException("Apenas o autor ou um ADMIN pode excluir o comentário");
                it.remove();
                return reviewRepository.save(review);
            }
        }
        throw new RuntimeException("Comentário não encontrado");
    }
}