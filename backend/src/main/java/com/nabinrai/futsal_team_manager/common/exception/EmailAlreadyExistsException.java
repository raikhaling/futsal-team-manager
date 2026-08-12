package com.nabinrai.futsal_team_manager.common.exception;

public class EmailAlreadyExistsException extends RuntimeException{
    public EmailAlreadyExistsException(String email){
        super("Email already exists: "+email);
    }
}
