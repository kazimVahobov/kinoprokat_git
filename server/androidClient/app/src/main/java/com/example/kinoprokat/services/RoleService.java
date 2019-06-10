package com.example.kinoprokat.services;

import com.example.kinoprokat.models.Permission;
import com.example.kinoprokat.models.Role;

public class RoleService {

    private String role_key = "role";
    private static RoleService mInstance;
    private Role currentRole;

    public static RoleService getInstance() {
        if (mInstance == null) {
            mInstance = new RoleService();
        }
        return mInstance;
    }

    public Role getCurrentRole() {
        return currentRole;
    }

    public void setCurrentRole(Role currentRole) {
        this.currentRole = currentRole;
    }

    public String get_th_rep(String type) {
        String result = "";
        switch (type) {
            case "th-rep": {
                result = "report-theater";
                break;
            }
        }
        return result;
    }

    public boolean checkPermission(int value, String groupName) {
        return currentRole.getPermissions().contains(new Permission(value, groupName));
    }

    public String getRole_key() {
        return role_key;
    }
}
