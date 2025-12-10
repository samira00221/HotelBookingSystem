package auca.ac.hotel_booking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PostConstruct;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") 
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    @Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/images/**")
            .addResourceLocations("file:/D:/Projects/hotel-booking/uploads/images/");
     registry.addResourceHandler("/amenities/**")
            .addResourceLocations("file:/D:/Projects/hotel-booking/uploads/amenities/");
}

@PostConstruct
public void printImagePath() {
    System.out.println("Serving images from: " + new java.io.File("uploads/images/").getAbsolutePath());
}
}