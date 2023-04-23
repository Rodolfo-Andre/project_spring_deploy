package com.proyecto.utils;

import java.util.Properties;
import javax.mail.*;
import javax.mail.Transport;
import javax.mail.internet.*;

public class ServicioCorreo implements Runnable {
  private String correo;
	private String mensaje;
	private String sujeto;
	
	public ServicioCorreo(String correo, String mensaje, String sujeto) {
		this.correo = correo;
		this.mensaje = mensaje;
		this.sujeto = sujeto;
	}
	
	public void enviarMensaje(String correo, String mensaje, String sujeto) {
		Properties propiedades = System.getProperties();

		propiedades.setProperty("mail.smtp.host", "smtp.office365.com");  
		propiedades.setProperty("mail.smtp.starttls.enable", "true");
		propiedades.setProperty("mail.smtp.port", "587");

		String correoEmisor = "pruebacorreoCib@outlook.com";
		String contrasena = "correoGmailCom";

		Session sesion = Session.getDefaultInstance(propiedades, new Authenticator() {
		    @Override
		    protected PasswordAuthentication getPasswordAuthentication() {
		         return new PasswordAuthentication (correoEmisor, contrasena);
		    }
		});

		MimeMessage mensajero = new MimeMessage(sesion); 

		try {
			mensajero.setFrom(new InternetAddress(correoEmisor));
			mensajero.addRecipient(Message.RecipientType.TO, new InternetAddress(correo));
			mensajero.setSubject(sujeto);
			mensajero.setText(mensaje);
			
			Transport.send(mensajero, mensajero.getRecipients(Message.RecipientType.TO));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void run() {
		enviarMensaje(correo, mensaje, sujeto);
	}
}
