package hu.proba.demo.controller;

import hu.proba.demo.entity.UserInfo;
import hu.proba.demo.pojo.AuthRequest;
import hu.proba.demo.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")

public class UserInfoController {

    @Autowired
    private UserInfoService service;

    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, Object>> generateToken(@RequestBody AuthRequest authRequest) {
        return service.generateToken(authRequest);
    }

    @PostMapping("/new")
    public ResponseEntity<String> addNewUser(@RequestBody UserInfo userInfo) {
        String response=service.addUser(userInfo);
        if(response.equals("User saved"))
            return ResponseEntity.ok().body("{\"message\": \"Registration was successful\"}");
        else
            return ResponseEntity.badRequest().body("{\"message\": \"User already exists\"}");
    }

    @GetMapping
    public List<UserInfo> getAllUsers() {
        return service.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserInfo> getUserById(@PathVariable Integer id) {
        UserInfo user = service.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }


    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateUser(@PathVariable Integer id, @RequestBody Map<String, String> updates) {
        UserInfo user = service.getUserById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Felhasználó nem található"));
        }

        if (updates.containsKey("email")) {
            user.setEmail(updates.get("email"));
        }
        if (updates.containsKey("password")) {
            user.setPwd(updates.get("password"));
        }
        if (updates.containsKey("uname")) {
            user.setUname(updates.get("uname"));
        }

        service.updateUser(id, user);
        return ResponseEntity.ok(Map.of("message", "Felhasználó frissítve"));
    }








    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }








}
