package com.nabinrai.futsal_team_manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class FutsalTeamManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(FutsalTeamManagerApplication.class, args);
    }

}
