package hu.proba.demo.service;

import hu.proba.demo.controller.helpers.PassHashHelper;
import hu.proba.demo.entity.UserInfo;
import hu.proba.demo.pojo.AuthRequest;
import hu.proba.demo.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.*;

@Service
public class UserInfoService {

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private JwtService jwtService;

    private byte[] salt = new byte[16];
    private Random random = new SecureRandom();
    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 256;


    public String addUser(UserInfo userInfo) {
        List<UserInfo> userList = userInfoRepository.findAll();


        for (UserInfo user : userList) {
            if (user.getUname().equals(userInfo.getUname()) || user.getEmail().equals(userInfo.getEmail())) {
                return "User already exists";
            }
        }


        if (userInfo.getRole() == null || userInfo.getRole().isEmpty()) {
            return "Role must be specified";
        }

        random.nextBytes(salt);
        KeySpec spec = new PBEKeySpec(userInfo.getPwd().toCharArray(), salt, ITERATIONS, KEY_LENGTH);
        try {
            SecretKeyFactory f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
            userInfo.setSalt(salt);
            userInfo.setPwd((new BigInteger(f.generateSecret(spec).getEncoded())).toString(16));
            userInfoRepository.save(userInfo);
            return "User saved";
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new AssertionError("Error while hashing a password: " + e.getMessage(), e);
        }
    }


    public ResponseEntity<Map<String, Object>> generateToken(AuthRequest authRequest) {
        Optional<UserInfo> loginUser = userInfoRepository.findByUname(authRequest.getUsername());
        if (loginUser.isEmpty() || authRequest.getPassword() == null || loginUser.get().getSalt() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String hashedPassword = PassHashHelper.getHash(authRequest.getPassword(), loginUser.get());
        if (!hashedPassword.equals(loginUser.get().getPwd())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } else {
            Optional<UserInfo> userInfo = userInfoRepository.findByUname(authRequest.getUsername());
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String role= userInfo.get().getRole();
            Integer userId = userInfo.get().getId();
            String token = jwtService.generateToken(authRequest.getUsername(),role);
            Map<String, Object> response = new HashMap<>();

            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);

            response.put("token", token);
            response.put("role", role);
            response.put("username", authRequest.getUsername());
            response.put("userId", userId);
            return ResponseEntity.ok(response);
        }
    }


    public List<UserInfo> getAllUsers() {
        return userInfoRepository.findAll();
    }

    public UserInfo getUserById(Integer id) {
        return userInfoRepository.findById(id).orElse(null);
    }



    public UserInfo updateUser(Integer id, UserInfo userDetails) {
        Optional<UserInfo> optionalUser = userInfoRepository.findById(id);
        if (optionalUser.isPresent()) {
            UserInfo user = optionalUser.get();

            if (userDetails.getEmail() != null) {
                user.setEmail(userDetails.getEmail());
            }

            if (userDetails.getPwd() != null) {

                byte[] salt = new byte[16];
                new SecureRandom().nextBytes(salt);
                KeySpec spec = new PBEKeySpec(userDetails.getPwd().toCharArray(), salt, ITERATIONS, KEY_LENGTH);
                try {
                    SecretKeyFactory f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
                    user.setSalt(salt);
                    user.setPwd(new BigInteger(f.generateSecret(spec).getEncoded()).toString(16));
                } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
                    throw new AssertionError("Error while hashing a password: " + e.getMessage(), e);
                }
            }

            if (userDetails.getUname() != null) {
                user.setUname(userDetails.getUname());
            }

            return userInfoRepository.save(user);
        }
        return null;
    }



    public void deleteUser(Integer id) {
        userInfoRepository.deleteById(id);
    }


}
