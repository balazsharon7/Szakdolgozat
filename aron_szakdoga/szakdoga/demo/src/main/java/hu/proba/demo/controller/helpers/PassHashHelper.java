package hu.proba.demo.controller.helpers;



import hu.proba.demo.entity.UserInfo;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;

public class PassHashHelper {
    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 256;
    public static String getHash(String password, UserInfo user) {
        KeySpec spec = new PBEKeySpec(password.toCharArray(), user.getSalt(), ITERATIONS, KEY_LENGTH);
        try {
            SecretKeyFactory f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
            return new BigInteger(f.generateSecret(spec).getEncoded()).toString(16);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new AssertionError("Error while hashing a password: " + e.getMessage(), e);
        }

    }
}