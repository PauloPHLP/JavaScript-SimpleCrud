const StorageController = (() => {
    return {
        storeUser: (user) => {
            let users;

            if (localStorage.getItem('users') === null) {
                users = [];
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            } else {
                users = JSON.parse(localStorage.getItem('users'));
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            }
        },

        getUsersFromStorage: () => {
            let users;
            
            if (localStorage.getItem('users') === null) {
              users = [];
            } else {
              users = JSON.parse(localStorage.getItem('users'));
            }

            return users;
          },

          updateUserStorage: (updatedUser) => {
            let users = JSON.parse(localStorage.getItem('users'));
      
            users.forEach((user, index) => {
              if (updatedUser.id === user.id){
                users.splice(index, 1, updatedUser);
              }
            });

            localStorage.setItem('users', JSON.stringify(users));
          },

          deleteUserFromStorage: (userToDelete) => {
            let users = JSON.parse(localStorage.getItem('users'));
            
            users.forEach((user, index) => {
              if(userToDelete.id === user.id){
                users.splice(index, 1);
              }
            });

            localStorage.setItem('users', JSON.stringify(users));
          },
          
          clearUsersFromStorage: () => {
            localStorage.removeItem('users');
          }
    }
})();

const UserController = (() => {
    const User = function(id, name, nickname, cpf, email) {
        this.id = id;
        this.name = name;
        this.nickname = nickname;
        this.cpf = cpf;
        this.email = email;
    }

    const userData = {
        users: StorageController.getUsersFromStorage(),
        currentUser: null
    }

    return {
        addUser: (user) => {
            let id;

            if (userData.users.length > 0) {
                id = userData.users[userData.users.length - 1].id + 1;
            } else {
                id = 0;
            }

            newUser = new User(id, user.name, user.nickname, user.cpf, user.email);

            userData.users.push(newUser);

            return newUser;
        },

        updateUser: (userToEdit) => {
            let found = null;

            userData.users.forEach((user) => {
                if (user.id === userData.currentUser.id) {
                    user.name = userToEdit.name;
                    user.nickname = userToEdit.nickname;
                    user.cpf = userToEdit.cpf;
                    user.email = userToEdit.email;

                    found = user;
                }
            });

            return found;
        },

        del: (userToDelete) => {
            const ids = userData.users.map((user) => {
                return user.id;
            })

            const index = ids.indexOf(userToDelete);

            userData.users.splice(index, 1);
        },

        clear: () => {
            userData.user = [];
        },

        setCurrentUser: (user) => {
            userData.currentUser = user;
        },

        getCurrentUser: () => {
            return userData.currentUser;
        },

        getUsers: () => {
            return userData.users;
        },

        getUserById: (id) => {
            let found = null;

            userData.users.forEach((user) => {
                if (user.id === id) {
                    found = user;
                }
            });

            return found;
        }
    }
})()

const UiController = (() => {
    const UiSelectors = {
        clear: '.clear-btn',
        name: '#person-name',
        nickname: '#person-nickname',
        cpf: '#person-cpf',
        email: '#person-email',
        add: '.add-btn',
        update: '.update-btn',
        delete: '.delete-btn',
        back: '.back-btn',
        persons: '#persons-list'
    };

    return {
        getUiSelectors: () => {
            return UiSelectors;
        },

        getUserInput: () => {
            return {
                name: document.querySelector(UiSelectors.name).value,
                nickname: document.querySelector(UiSelectors.nickname).value,
                cpf: document.querySelector(UiSelectors.cpf).value,
                email: document.querySelector(UiSelectors.email).value
            }
        },

        cleanInput: () => {
            document.querySelector(UiSelectors.name).value = '',
            document.querySelector(UiSelectors.nickname).value = '',
            document.querySelector(UiSelectors.cpf).value = '',
            document.querySelector(UiSelectors.email).value = ''
        },

        populateList: (userList) => {
            let html = '';

            userList.forEach((user) => {
                html += 
                    `<li class="collection-item" id="person-${user.id}">
                        <strong>Name: </strong><em>${user.name}</em>
                        <br>
                        <strong>Nickname: </strong><em>${user.nickname}</em>
                        <br>
                        <strong>CPF: </strong><em>${user.cpf}</em>
                        <br>
                        <strong>E-mail: </strong><em>${user.email}</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>
                    `;
            });

            document.querySelector(UiSelectors.persons).innerHTML = html;
        },

        addListUser: (user) => {
            document.querySelector(UiSelectors.persons).style.display = 'block';
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `person-${user.id}`;
            li.innerHTML = 
                          `<li class="collection-item" id="person-${user.id}">
                                <strong>Name: </strong><em>${user.name}</em>
                                <br>
                                <strong>Nickname: </strong><em>${user.nickname}</em>
                                <br>
                                <strong>CPF: </strong><em>${user.cpf}</em>
                                <br>
                                <strong>E-mail: </strong><em>${user.email}</em>
                                <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                                </a>
                            </li>
                            `; 

            document.querySelector(UiSelectors.persons).insertAdjacentElement('beforeend', li);
        },

        updateListUser: (userToEdit) => {
            let listUsers = document.querySelectorAll(UiSelectors.persons);

            listUsers = Array.from(listUsers);
            
            listUsers.forEach((user) => {
                const userId = user.getAttribute('id');

                if (userId === `person-${userToEdit.id}`) {
                    document.querySelector(`#${userId}`).innerHTML = 
                                `<strong>Name:</strong><em> ${userToEdit.name}</em>
                                <br>
                                <strong>Nickname:</strong><em> ${userToEdit.nickname}</em>
                                <br>
                                <strong>CPF:</strong><em> ${userToEdit.cpf}</em>
                                <br>
                                <strong>E-mail:</strong><em> ${userToEdit.email}</em>
                                `;
                }
            });
        },

        del: (userToDelete) => {
            const userId = `#person-${userToDelete.id}`;
            const user = document.querySelector(userId);
            user.remove();
        },

        removeUsers: () => {
            let listUsers = document.querySelectorAll(UiSelectors.persons);

            listUsers = Array.from(listUsers);

            listUsers.forEach((user) => {
                user.remove();
            });

            location.reload();
        },

        addUserToForm: (userToEdit) => {
            document.querySelector(UiSelectors.name).value = userToEdit.name;
            document.querySelector(UiSelectors.nickname).value = userToEdit.nickname;
            document.querySelector(UiSelectors.cpf).value = userToEdit.cpf;
            document.querySelector(UiSelectors.email).value = userToEdit.email;
        },

        showEditState: () => {
            document.querySelector(UiSelectors.add).style.display = 'none';
            document.querySelector(UiSelectors.update).style.display = 'inline';
            document.querySelector(UiSelectors.delete).style.display = 'inline';
            document.querySelector(UiSelectors.back).style.display = 'inline';
        },

        clearEditState: () => {
            UiController.cleanInput();
            document.querySelector(UiSelectors.add).style.display = 'inline';
            document.querySelector(UiSelectors.update).style.display = 'none';
            document.querySelector(UiSelectors.delete).style.display = 'none';
            document.querySelector(UiSelectors.back).style.display = 'none';
        },

        hideList: () => {
            document.querySelector(UiSelectors.persons).style.display = 'none';
        }
    }
})()

const AppController = ((UserController, UiController, StorageController) => {
    const loadEventListeners = () => {
        UiSelectors = UiController.getUiSelectors();
        
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        document.querySelector(UiSelectors.add).addEventListener('click', add);
        document.querySelector(UiSelectors.persons).addEventListener('click', edit);
        document.querySelector(UiSelectors.update).addEventListener('click', update);
        document.querySelector(UiSelectors.delete).addEventListener('click', del);
        document.querySelector(UiSelectors.clear).addEventListener('click', clear);
        document.querySelector(UiSelectors.back).addEventListener('click', UiController.clearEditState);
    }

    const add = (e) => {
        const input = UiController.getUserInput();
        
        if (input.name !== '' && input.nickname !== '' && input.cpf !== '' && input.email !== '') {
            const newUser = UserController.addUser(input);

            UiController.addListUser(newUser);
            StorageController.storeUser(newUser);

            UiController.cleanInput();
        }

        e.preventDefault();
    }

    const edit = (e) => {
        if (e.target.classList.contains('edit-item')) {
            const personId = e.target.parentNode.parentNode.id;
            const idList = personId.split('-');
            const id = parseInt(idList[1]);
            const userToEdit = UserController.getUserById(id);

            UiController.showEditState();
            UserController.setCurrentUser(userToEdit);
            UiController.addUserToForm(userToEdit);
        }

        e.preventDefault();
    }

    const update = (e) => {
        const input = UiController.getUserInput();
        const updatedUser = UserController.updateUser(input);

        //UiController.updateListUser(updatedUser);
        const usersList = UserController.getUsers();
        UiController.populateList(usersList);
        StorageController.updateUserStorage(updatedUser);
        UiController.clearEditState();
        
        e.preventDefault();
    }

    const del = (e) => {
        const userToDelete = UserController.getCurrentUser();

        UserController.del(userToDelete);
        UiController.del(userToDelete);            
        StorageController.deleteUserFromStorage(userToDelete);
        UiController.clearEditState();
        
        e.preventDefault();
    }

    const clear = (e) => {
        UserController.clear();
        UiController.removeUsers();
        //UiController.hideList();
        StorageController.clearUsersFromStorage();
    }

    return {
        initialize: () => {
            UiController.clearEditState();

            const users = UserController.getUsers();

            if (users.length === 0) {
                UiController.hideList();
            } else {
                UiController.populateList(users);
            }

            loadEventListeners();
        }
    }
})(UserController, UiController, StorageController)

AppController.initialize();