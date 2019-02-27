const StorageController = (() => {
  return {
    storeUser: (user) => {
      let users;

      if (localStorage.getItem('users') === null){
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
        if(updatedUser.id === user.id){
          users.splice(index, 1, updatedUser);
        }
      });

      localStorage.setItem('users', JSON.stringify(users));
    },

    deleteUserFromStorage: (id) => {
      let users = JSON.parse(localStorage.getItem('users'));
      
      users.forEach((user, index) => {
        if(id === user.id){
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
  const User = function(id, name, nickname, cpf, email){
    this.id = id;
    this.name = name;
    this.nickname = nickname;
    this.cpf = cpf;
    this.email = email;
  }

  const data = {
    users: StorageController.getUsersFromStorage(),
    currentUser: null
  }

  return {
    getUsers: () => {
      return data.users;
    },

    addUser: (name, nickname, cpf, email) => {
      let ID;

      if (data.users.length > 0) {
        ID = data.users[data.users.length - 1].id + 1;
      } else {
        ID = 0;
      }

      newUser = new User(ID, name, nickname, cpf, email);

      data.users.push(newUser);

      return newUser;
    },

    getUserById: (id) => {
      let found = null;

      data.users.forEach((user) => {
        if(user.id === id){
          found = user;
        }
      });

      return found;
    },

    updateUser: (name, nickname, cpf, email) => {
      let found = null;

      data.users.forEach((user) => {
        if(user.id === data.currentUser.id){
          user.name = name;
          user.nickname = nickname;
          user.cpf = cpf;
          user.email = email;
          found = user;
        }
      });

      return found;
    },

    deleteUser: (id) => {
      const ids = data.users.map((user) => {
        return user.id;
      });

      const index = ids.indexOf(id);

      data.users.splice(index, 1);
    },

    clearAllUsers: () => {
      data.users = [];
    },

    setCurrentUser: (user) => {
      data.currentUser = user;
    },

    getCurrentUser: () => {
      return data.currentUser;
    },
    
    logData: () => {
      return data;
    }
  }
})();

const UiController = (() => {
  const UiSelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemNicknameInput: '#item-nickname',
    itemCpfInput: '#item-cpf',
    itemEmailInput: '#item-email',
    totalCalories: '.total-calories'
  }
  
  return {
    populateUserList: (users) => {
      let html = '';

      users.forEach((user) => {
        html += `
          <li class="collection-item" id="item-${user.id}">
          <strong>Name: </strong><em>${user.name}</em>
          <br>
          <strong>Nickname: </strong><em>${user.nickname}</em>
          <br>
          <strong>CPF: </strong><em>${user.cpf}</em>
          <br>
          <strong>E-mail: </strong><em>${user.email}</em>
          <br>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          </li>
        `;
      });

      document.querySelector(UiSelectors.itemList).innerHTML = html;
    },

    getUserInput: () => {
      return {
        name: document.querySelector(UiSelectors.itemNameInput).value,
        nickname: document.querySelector(UiSelectors.itemNicknameInput).value,
        cpf: document.querySelector(UiSelectors.itemCpfInput).value,
        email: document.querySelector(UiSelectors.itemEmailInput).value
      }
    },

    addListUser: (user) => {
      document.querySelector(UiSelectors.itemList).style.display = 'block';
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${user.id}`;
      li.innerHTML = `
      <td>
      </td>
      <td>${user.name}</td>
      <td>${user.nickname}</td>
      <td>${user.cpf}</td>
      <td>${user.email}</td>
      <td>
        <a href="#editPersonModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
        <a href="#deletePersonModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
      </td>`; 

      document.querySelector(UiSelectors.itemList).insertAdjacentElement('beforeend', li);

      location.reload();
    },

    updateListUser: (user) => {
      let listUsers = document.querySelectorAll(UiSelectors.listItems);

      listUsers = Array.from(listUsers);

      listUsers.forEach((listUser) => {
        const userID = listUser.getAttribute('id');

        if (id === `item-${user.id}`) {
          document.querySelector(`#${id}`).innerHTML = 
          `<strong>Name:</strong><em> ${user.name}</em>
          <br>
          <strong>Nickname:</strong><em> ${user.nickname}</em>
          <br>
          <strong>CPF:</strong><em> ${user.cpf}</em>
          <br>
          <strong>E-mail:</strong><em> ${user.email}</em>
          `;
        }
      });
    },

    deleteListUser: (id) => {
      const userID = `#item-${id}`;
      const user = document.querySelector(userID);
      user.remove();
    },

    clearInput: () => {
      document.querySelector(UiSelectors.itemNameInput).value = '';
      document.querySelector(UiSelectors.itemNicknameInput).value = '';
      document.querySelector(UiSelectors.itemCpfInput).value = '';
      document.querySelector(UiSelectors.itemEmailInput).value = '';
    },

    addUserToForm: () => {
      document.querySelector(UiSelectors.itemNameInput).value = UserController.getCurrentUser().name;
      document.querySelector(UiSelectors.itemNicknameInput).value = UserController.getCurrentUser().nickname;
      document.querySelector(UiSelectors.itemCpfInput).value = UserController.getCurrentUser().cpf;
      document.querySelector(UiSelectors.itemEmailInput).value = UserController.getCurrentUser().email;
      UiController.showEditState();
    },

    removeUsers: () => {
      let listUsers = document.querySelectorAll(UiSelectors.listItems);

      listUsers = Array.from(listUsers);

      listUsers.forEach((user) => {
        user.remove();
      });
    },

    hideList: () => {
      document.querySelector(UiSelectors.itemList).style.display = 'none';
    },
    
    clearEditState: () => {
      UiController.clearInput();
      document.querySelector(UiSelectors.updateBtn).style.display = 'none';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'none';
      document.querySelector(UiSelectors.backBtn).style.display = 'none';
      document.querySelector(UiSelectors.addBtn).style.display = 'inline';
    },

    showEditState: () => {
      document.querySelector(UiSelectors.updateBtn).style.display = 'inline';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UiSelectors.backBtn).style.display = 'inline';
      document.querySelector(UiSelectors.addBtn).style.display = 'none';
    },

    getSelectors: () => {
      return UiSelectors;
    }
  }
})();

const AppController = ((UserController, StorageController, UiController) => {
  const loadEventListeners = () => {

    const UiSelectors = UiController.getSelectors();

    document.querySelector(UiSelectors.addBtn).addEventListener('click', userAddSubmit);

    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    document.querySelector(UiSelectors.itemList).addEventListener('click', userEditClick);
    document.querySelector(UiSelectors.updateBtn).addEventListener('click', userUpdateSubmit);
    document.querySelector(UiSelectors.deleteBtn).addEventListener('click', userDeleteSubmit);
    document.querySelector(UiSelectors.backBtn).addEventListener('click', UiController.clearEditState);
    document.querySelector(UiSelectors.clearBtn).addEventListener('click', clearAllUsersClick);
  }

  const userAddSubmit = (e) => {
    const input = UiController.getUserInput();

    if (input.name !== '' && input.nickname !== '' && input.cpf !== '' && input.email !== '') {

      const newUser = UserController.addUser(input.name, input.nickname, input.cpf, input.email);

      UiController.addListUser(newUser);

      StorageController.storeUser(newUser);

      UiController.clearInput();
    }

    e.preventDefault();
  }

  const userEditClick = (e) => {
    if (e.target.classList.contains('edit-item')) {
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      const userToEdit = UserController.getUserById(id);

      UserController.setCurrentUser(userToEdit);
      UiController.addUserToForm();
    }

    e.preventDefault();
  }

  const userUpdateSubmit = (e) => {
    const input = UiController.getUserInput();

    const updatedUser = UserController.updateUser(input.name, input.nickname, input.cpf, input.email);

    UiController.updateListUser(updatedUser);
    StorageController.updateUserStorage(updatedUser);
    UiController.clearEditState();

    e.preventDefault();
  }

  const userDeleteSubmit = (e) => {
    const currentUser = UserController.getCurrentUser();

    UserController.deleteUser(clientInformation);
    UiController.deleteListUser(currentUser.id);
    StorageController.deleteUserFromStorage(currentUser.id);

    UiController.clearEditState();

    e.preventDefault();
  }

  const clearAllUsersClick = () => {
    UserController.clearAllUsers();
    UiController.removeUsers();
    StorageController.clearUsersFromStorage();
    UiController.hideList();    
  }

  return {
    init: () => {
      UiController.clearEditState();
      
      const items = UserController.getUsers();
      
      if(items.length === 0){
        UiController.hideList();
      } else {
        UiController.populateUserList(items);
      }
      
      loadEventListeners();
    }
  }
  
})(UserController, StorageController, UiController);

AppController.init();