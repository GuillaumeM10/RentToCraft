"use client";

import { type UserDto } from "@rent-to-craft/dtos";
import React, { useEffect, useState } from "react";

import UpdateUser from "@/app/components/Forms/User/UpdateUser";
import OffCanvas from "@/app/components/OffCanvas";
import UserService from "@/app/services/user.service";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserDto[]>([]);

  const getAll = async () => {
    const fetchedUsers = await UserService.getAll();
    setUsers(fetchedUsers);
  };

  const deleteUser = async (userId: number) => {
    const success = await UserService.delete(userId);
    if (success) {
      void getAll();
    }
  };

  useEffect(() => {
    void getAll();
  }, []);

  return (
    <div>
      <h1 className="text-3xl">Utilisateurs</h1>

      <div className="mt-20">
        <table className="table">
          <thead>
            <tr>
              <th className="w-20">ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="w-20">
                <td>{user.id}</td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.id && (
                    <div className="flex gap-10">
                      <OffCanvas
                        autoCloseOnClick={true}
                        buttonContent="Modifier"
                        buttonClassName="btn btn-underline-primary btn-small"
                        dialogClassName="update-user-offcanvas"
                      >
                        <UpdateUser
                          userId={user.id}
                          onSuccess={async () => {
                            await getAll();
                          }}
                          initData={user}
                        />
                      </OffCanvas>
                      <button
                        className="btn btn-underline-red btn-small"
                        onClick={() => deleteUser(user.id!)}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
