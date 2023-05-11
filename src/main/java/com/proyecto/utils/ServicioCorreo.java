package com.proyecto.utils;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class ServicioCorreo {
  public static void enviarMensaje(String correo, String mensaje, String sujeto) throws Exception {
    Properties propiedades = System.getProperties();

    propiedades.put("mail.smtp.host", "smtp.office365.com");
    propiedades.setProperty("mail.smtp.starttls.enable", "true");
    propiedades.setProperty("mail.smtp.port", "587");
    propiedades.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");
    propiedades.setProperty("mail.smtp.auth", "true");

    String correoEmisor = "pruebacorreoCib@outlook.com";
    String contrasena = "CorreoGmailCom";

    Session sesion = Session.getDefaultInstance(propiedades);

    MimeMessage mensajero = new MimeMessage(sesion);
    mensajero.setFrom(new InternetAddress(correoEmisor));
    mensajero.setRecipient(Message.RecipientType.TO, new InternetAddress(correo));
    mensajero.setSubject(sujeto);
    mensajero.setText(mensaje);

    Transport transporte = sesion.getTransport("smtp");

    try {
      transporte.connect(correoEmisor, contrasena);
      transporte.sendMessage(mensajero, mensajero.getAllRecipients());
      System.out.println("Enviando Mensaje");
    } catch (Exception e) {
      e.printStackTrace();
      System.out.println("El email no ha sido enviado");
    } finally {
      transporte.close();
    }
  }
}
