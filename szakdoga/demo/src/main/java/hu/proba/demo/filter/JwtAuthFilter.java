package hu.proba.demo.filter;

import java.io.IOException;


import hu.proba.demo.service.JwtService;
import hu.proba.demo.service.UserInfoUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserInfoUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = null;
        String username = null;
        String header = request.getHeader("Authorization");
        if (null != header && header.startsWith("Bearer ")) {
            try {
                token = header.substring(7);
                username = jwtService.extractUsername(token);
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                response.setStatus(HttpStatus.I_AM_A_TEAPOT.value());
                // Add a WWW-Authenticate header indicating the type of authentication required
                response.setHeader("WWW-Authenticate", "Bearer realm=\"Your API\", error=\"invalid_token\", error_description=\"The access token has expired. Please obtain a new token.\"");
                response.getWriter().write("Unauthorized: Access token has expired.");
                return;
            }
        }
        if (null != username && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken userToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                userToken.setDetails(new WebAuthenticationDetails(request));
                SecurityContextHolder.getContext().setAuthentication(userToken);
            }
        }
        filterChain.doFilter(request, response);
        return;
    }
}