package auca.ac.hotel_booking.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;


@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Enumerated(EnumType.STRING)
    private PaymentType paymentMethod;

    private double amountPaid;
    private String transactionId;
    private LocalDate paymentDate;

    private boolean confirmed = false;
    private String confirmationToken;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @OneToOne(mappedBy = "payment")
    @JsonBackReference("bookingPayment")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public Payment() {}

    public Payment(Long paymentId, double amountPaid, PaymentType paymentMethod, String transactionId, LocalDate paymentDate, PaymentStatus paymentStatus, Booking booking, User user, String confirmationToken, boolean confirmed) {
        this.paymentId = paymentId;
        this.amountPaid = amountPaid;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.paymentDate = paymentDate;
        this.paymentStatus = paymentStatus;
        this.booking = booking;
        this.user = user;
        this.confirmationToken = confirmationToken;
        this.confirmed = confirmed;
    }


    public User getUser() {return user;}
    public void setUser(User user) {this.user = user;}
    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }
    public double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(double amountPaid) { this.amountPaid = amountPaid; }
    public PaymentType getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentType paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    public boolean isConfirmed() {return confirmed;}
    public void setConfirmed(boolean confirmed) {this.confirmed = confirmed;}
    public String getConfirmationToken() {return confirmationToken; }
    public void setConfirmationToken(String confirmationToken) {this.confirmationToken = confirmationToken;}
}