package com.proyecto.interfaces;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@AuthenticationPrincipal
@Retention(RetentionPolicy.RUNTIME)
public @interface UsuarioActual {
}
