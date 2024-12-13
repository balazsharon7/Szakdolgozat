package hu.proba.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "userinfo")
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    @Column(name = "uname")
    private String uname;
    @Column(name = "email")
    private String email;
    @Column(name = "pwd")
    private String pwd;
    @Column(name = "salt")
    private byte[] salt;
    @Column(name = "role")
    private String role;


    @Override
    public String toString() {
        return "UserInfo{" +
                "id=" + id +
                ", uname='" + uname + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}