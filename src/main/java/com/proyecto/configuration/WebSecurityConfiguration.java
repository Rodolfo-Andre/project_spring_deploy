package com.proyecto.configuration;

import org.springframework.context.annotation.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.proyecto.service.UsuarioDetallesService;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration {
  @Bean
  public WebSecurityCustomizer configure() {
    return web -> web.ignoring().requestMatchers("/css/**", "/js/**",
        "/images/**", "/language/**");
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .authorizeHttpRequests(a ->

        a.requestMatchers("/login/**").permitAll()
            .requestMatchers("/configuracion/mesa/obtener",
                "/configuracion/plato/obtener",
                "/configuracion/categoria-plato/obtener")
            .hasAnyRole("MESERO", "COCINERO", "CAJERO", "ADMINISTRADOR")
            .requestMatchers("/configuracion/comanda/**").hasAnyRole(
                "ADMINISTRADOR", "MESERO", "COCINERO",
                "CAJERO")
            .requestMatchers("/configuracion/**").hasRole("ADMINISTRADOR")
            .requestMatchers("/**").authenticated())
        .formLogin(t -> t.loginPage("/login")
            .usernameParameter("email")
            .loginProcessingUrl("/login")
            .defaultSuccessUrl("/")
            .permitAll());

    return http.build();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider(UsuarioDetallesService usuarioDetallesService) {
    final DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

    authProvider.setUserDetailsService(usuarioDetallesService);
    authProvider.setPasswordEncoder(encoder());

    return authProvider;
  }

  @Bean
  public PasswordEncoder encoder() {
    return new BCryptPasswordEncoder(11);
  }
}
