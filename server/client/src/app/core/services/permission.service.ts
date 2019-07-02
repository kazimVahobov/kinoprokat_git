import { Injectable } from '@angular/core';
import { Permission } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  users: Permission[];
  contractRKM: Permission[];
  contractDist: Permission[];
  contractTheater: Permission[];
  reportRKM: Permission[];
  reportDist: Permission[];
  reportTheater: Permission[];
  movies: Permission[];
  theaters: Permission[];
  distributors: Permission[];
  roles: Permission[];
  regions: Permission[];

  userRead = false;
  theaterRead = false;
  movieRead = false;
  contractRKMRead = false;
  contractDistRead = false;
  contractTheaterRead = false;
  reportRKMRead = false;
  reportDistRead = false;
  reportTheaterRead = false;
  distributorRead = false;
  roleRead = false;
  regionRead = false;

  userPermissions = {
    checked: false,
    label: 'Относительно пользователей',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех дочерних пользователей',
        value: 1,
        checked: false,
        groupName: 'user'
      },
      {
        label: 'Создание',
        description: 'Разрешить создание нового дочернего пользователя',
        value: 0,
        checked: false,
        groupName: 'user'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование всех данных определенного дочернего пользователя кроме пароля',
        value: 2,
        checked: false,
        groupName: 'user'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление определенного дочернего пользователя без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'user'
      },
      {
        label: 'Сброс пароля',
        description: 'Разрешить сбрасывать старый и устанавливать новый пароль определенного дочернего пользователя',
        value: 5,
        checked: false,
        groupName: 'user'
      }
    ]
  };
  rolePermissions = {
    checked: false,
    label: 'Относительно ролей пользователей',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех ролей',
        value: 1,
        checked: false,
        groupName: 'role'
      },
      {
        label: 'Создание',
        description: 'Разрешить создание новой роли',
        value: 0,
        checked: false,
        groupName: 'role'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование всех разрешений определенной роли',
        value: 2,
        checked: false,
        groupName: 'role'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление определенной роли без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'role'
      }
    ]
  };
  regionPermissions = {
    checked: false,
    label: 'Относительно регион Кинотеатров и Дистрибуторов',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех регионам',
        value: 1,
        checked: false,
        groupName: 'region'
      },
      {
        label: 'Создание',
        description: 'Разрешить создание новой регион',
        value: 0,
        checked: false,
        groupName: 'region'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование всех разрешений определенной региона',
        value: 2,
        checked: false,
        groupName: 'region'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление определенной региона без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'region'
      }
    ]
  };
  moviePermissions = {
    checked: false,
    label: 'Относительно фильмов',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех фильмов',
        value: 1,
        checked: false,
        groupName: 'movie'
      },
      {
        label: 'Создание',
        description: 'Разрешить добавление новых фильмов в базу данных',
        value: 0,
        checked: false,
        groupName: 'movie'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование всех данных любого фильма из базы данных',
        value: 2,
        checked: false,
        groupName: 'movie'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление любого фильма из базы данных без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'movie'
      }
    ]
  };
  theaterPermissions = {
    checked: false,
    label: 'Относительно кинотеатров',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех дочерних кинотеатров',
        value: 1,
        checked: false,
        groupName: 'theater'
      },
      {
        label: 'Создание',
        description: 'Разрешить добавление новых дочерних кинотеатров в базу данных',
        value: 0,
        checked: false,
        groupName: 'theater'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование всех данных дочернего кинотеатра из базы данных',
        value: 2,
        checked: false,
        groupName: 'theater'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление дочернего кинотеатра из базы данных без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'theater'
      }
    ]
  };
  distributorPermissions = {
    checked: false,
    label: 'Относительно дистрибьюторов',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех субдистрибьюторов',
        value: 1,
        checked: false,
        groupName: 'distributor'
      },
      {
        label: 'Создание',
        description: 'Разрешить добавление новых субдистрибьюторов в базу данных',
        value: 0,
        checked: false,
        groupName: 'distributor'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование всех данных субдистрибьютора из базы данных',
        value: 2,
        checked: false,
        groupName: 'distributor'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление субдистрибьютора из базы данных без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'distributor'
      }
    ]
  };
  contractFPermissions = {
    checked: false,
    label: 'Относительно договоров между Правообл. и RKM',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех договоров между Правообладателями и RKM',
        value: 1,
        checked: false,
        groupName: 'cont-f'
      },
      {
        label: 'Создание',
        description: 'Разрешить создание новых договоров между Правообладателями и RKM',
        value: 0,
        checked: false,
        groupName: 'cont-f'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование всех данных договоров между Правообладателями и RKM',
        value: 2,
        checked: false,
        groupName: 'cont-f'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление договоров между Правообладателями и RKM без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'cont-f'
      }
    ]
  };
  contractSPermissions = {
    checked: false,
    label: 'Относительно договоров между RKM и дистрибьютором',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех договоров между RKM и Субдистрибьютором',
        value: 1,
        checked: false,
        groupName: 'cont-s'
      },
      {
        label: 'Создание',
        description: 'Разрешить создание новых договоров между RKM и Субдистрибьютором',
        value: 0,
        checked: false,
        groupName: 'cont-s'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование всех данных договоров между RKM и Субдистрибьютором',
        value: 2,
        checked: false,
        groupName: 'cont-s'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление договоров между RKM и Субдистрибьютором без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'cont-s'
      }
    ]
  };
  contractTPermissions = {
    checked: false,
    label: 'Относительно договоров между дистр. и кинотеатром',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех договоров между Дистрибьютором и дочерним кинотеатром',
        value: 1,
        checked: false,
        groupName: 'cont-t'
      },
      {
        label: 'Создание',
        description: 'Разрешить создание новых договоров между Дистрибьютором и дочерним кинотеатром',
        value: 0,
        checked: false,
        groupName: 'cont-t'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование всех данных договоров между Дистрибьютором и дочерним кинотеатром',
        value: 2,
        checked: false,
        groupName: 'cont-t'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление договоров между Дистрибьютором и дочерним кинотеатром без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'cont-t'
      }
    ]
  };
  reportRKMPermissions = {
    checked: false,
    label: 'Относительно отчётов RKM',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех отчётов, поступивших в RKM от субдистрибьюторов',
        value: 1,
        checked: false,
        groupName: 'report-rkm'
      },
      {
        label: 'Подтверждение (дистрибьюторы)',
        description: 'Разрешить подтверждение или обратную отсылку отчётов, поступивших в RKM от субдистрибьюторов',
        value: 4,
        checked: false,
        groupName: 'report-rkm'
      },
      {
        label: 'Подтверждение (кинотеатры)',
        description: 'Разрешить подтверждение или обратную отсылку отчётов, поступивших в RKM от кинотеатров',
        value: 6,
        checked: false,
        groupName: 'report-rkm'
      }
    ]
  };
  reportDistributorPermissions = {
    checked: false,
    label: 'Относительно отчётов дистрибьюторов',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех отчётов, отправленных дистрибьютором в RKM',
        value: 1,
        checked: false,
        groupName: 'report-dist'
      },
      {
        label: 'Создание',
        description: 'Разрешить создание новых отчётов для отправки в RKM на основе отчётов, поступивших дистрибьютору от дочерних кинотеатров',
        value: 0,
        checked: false,
        groupName: 'report-dist'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование отчётов, которые были заранее подготовлены или отказаны RKM, перед (повторной отправкой в случае отказа) отправкой в RKM',
        value: 2,
        checked: false,
        groupName: 'report-dist'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление отчётов, которые были заранее подготовлены или отказаны RKM, без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'report-dist'
      },
      {
        label: 'Подтверждение',
        description: 'Разрешить подтверждение или обратную отсылку отчётов, поступивших в дистрибьютору от кинотеатра',
        value: 6,
        checked: false,
        groupName: 'report-dist'
      }
    ]
  };
  reportTheaterPermissions = {
    checked: false,
    label: 'Относительно отчётов кинотеатров',
    permissions: [
      {
        label: 'Чтение',
        description: 'Открыть доступ к списку всех отчётов, отправленных сотрудником кинотеатра дистрибьютору',
        value: 1,
        checked: false,
        groupName: 'report-theater'
      },
      {
        label: 'Создание',
        description: 'Разрешить создание новых отчётов для отправки дистрибьютору',
        value: 0,
        checked: false,
        groupName: 'report-theater'
      },
      {
        label: 'Редактирование',
        description: 'Разрешить редактирование отчётов, которые были заранее подготовлены или отказаны дистрибьютором, перед (повторной отправкой в случае отказа) отправкой дистрибьютору',
        value: 2,
        checked: false,
        groupName: 'report-theater'
      },
      {
        label: 'Удаление',
        description: 'Разрешить удаление отчётов, которые были заранее подготовлены или отказаны дистрибьютором, без возможности восстановления',
        value: 3,
        checked: false,
        groupName: 'report-theater'
      }
    ]
  };
  roleTypes: RoleType[] = [

    {
      code: 0,
      label: 'Главный управляющий',
      description: 'Данная категория объединяет внутри себя группы разрешений, которые могут быть включены для роли на уровне главного управляющего',
      groups: [
        this.userPermissions,
        this.moviePermissions,
        this.theaterPermissions,
        this.distributorPermissions,
        this.contractFPermissions,
        this.contractSPermissions,
        this.contractTPermissions,
        this.reportRKMPermissions,
        this.rolePermissions,
        this.regionPermissions
      ],
      checked: false
    },
    {
      code: 1,
      label: 'Субдистрибьютор',
      description: 'Данная категория объединяет внутри себя группы разрешений, которые могут быть включены для роли на уровне субдистрибьютора',
      groups: [
        this.moviePermissions,
        this.userPermissions,
        this.theaterPermissions,
        this.contractSPermissions,
        this.contractTPermissions,
        this.reportDistributorPermissions
      ],
      checked: false
    },
    {
      code: 2,
      label: 'Кинотеатр',
      description: 'Данная категория объединяет внутри себя группы разрешений, которые могут быть включены для роли на уровне кинотеатра',
      groups: [
        this.moviePermissions,
        this.userPermissions,
        this.contractTPermissions,
        this.reportTheaterPermissions
      ],
      checked: false
    },
    {
      code: 3,
      label: 'Гость',
      description: 'Данная категория объединяет внутри себя группы разрешений, которые могут быть включены для роли на уровне обычного посетителя',
      groups: [
        this.moviePermissions,
        this.theaterPermissions,
        this.contractFPermissions,
        this.contractSPermissions,
        this.contractTPermissions
      ],
      checked: false
    }
  ];

  permissions;
  typeOfRole;
  temp: any;

  constructor() { }

  userActivePermission() {

    this.temp = null;
    this.temp = JSON.parse(localStorage.getItem('role'))?JSON.parse(localStorage.getItem('role')):null;

    this.permissions = this.temp.permissions;
    this.typeOfRole = this.temp.typeOfRole;

    this.getUserPermissions();
    this.getContractDistPermissions();
    this.getContractRKMPermissions();
    this.getContractTheaterPermissions();
    this.getReportDistPermissions();
    this.getReportRKMPermissions();
    this.getReportTheaterPermissions();
    this.getDistributorPermissions();
    this.getMoviePermissions();
    this.getTheaterPermissions();
    this.getRolePermissions();
    this.getRegionPermissions();

    if (this.users.find(u => u.value === 1)) {
      this.userRead = true;
    } else {
      this.userRead = false;
    }
    if (this.roles.find(u => u.value === 1)) {
      this.roleRead = true;
    } else {
      this.roleRead = false;
    }
    if (this.theaters.find(u => u.value === 1)) {
      this.theaterRead = true;
    } else {
      this.theaterRead = false;
    }
    if (this.movies.find(u => u.value === 1)) {
      this.movieRead = true;
    } else {
      this.movieRead = false;
    }
    if (this.distributors.find(u => u.value === 1)) {
      this.distributorRead = true;
    } else {
      this.distributorRead = false;
    }
    if (this.contractDist.find(u => u.value === 1)) {
      this.contractDistRead = true;
    } else {
      this.contractDistRead = false;
    }
    if (this.contractRKM.find(u => u.value === 1)) {
      this.contractRKMRead = true;
    } else {
      this.contractRKMRead = false;
    }
    if (this.contractTheater.find(u => u.value === 1)) {
      this.contractTheaterRead = true;
    } else {
      this.contractTheaterRead = false;
    }
    if (this.reportDist.find(u => u.value === 1)) {
      this.reportDistRead = true;
    } else {
      this.reportDistRead = false;
    }
    if (this.reportRKM.find(u => u.value === 1)) {
      this.reportRKMRead = true;
    } else {
      this.reportRKMRead = false;
    }
    if (this.reportTheater.find(u => u.value === 1)) {
      this.reportTheaterRead = true;
    } else {
      this.reportTheaterRead = false;
    }
    if (this.regions.find(u => u.value === 1)) {
      this.regionRead = true;
    } else {
      this.regionRead = false;
    }
  }
  // get permissions group
  getUserPermissions() {
    this.users = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'user') {
        this.users.push(element);
      }
    });
  }
    // get permissions group
    getRegionPermissions() {
      this.regions = [];
      this.permissions.forEach(element => {
        if (element.groupName === 'region') {
          this.regions.push(element);
        }
      });
    }
  getRolePermissions() {
    this.roles = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'role') {
        this.roles.push(element);
      }
    });
  }
  getContractRKMPermissions() {
    this.contractRKM = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'cont-f') {
        this.contractRKM.push(element);
      }
    });
  }
  getContractDistPermissions() {
    this.contractDist = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'cont-s') {
        this.contractDist.push(element);
      }
    });
  }
  getContractTheaterPermissions() {
    this.contractTheater = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'cont-t') {
        this.contractTheater.push(element);
      }
    });
  }
  getReportDistPermissions() {
    this.reportDist = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'report-dist') {
        this.reportDist.push(element);
      }
    });
  }
  getReportRKMPermissions() {
    this.reportRKM = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'report-rkm') {
        this.reportRKM.push(element);
      }
    });
  }
  getReportTheaterPermissions() {
    this.reportTheater = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'report-theater') {
        this.reportTheater.push(element);
      }
    });
  }
  getTheaterPermissions() {
    this.theaters = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'theater') {
        this.theaters.push(element);
      }
    });
  }
  getMoviePermissions() {
    this.movies = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'movie') {
        this.movies.push(element);
      }
    });
  }
  getDistributorPermissions() {
    this.distributors = [];
    this.permissions.forEach(element => {
      if (element.groupName === 'distributor') {
        this.distributors.push(element);
      }
    });
  }
}
// RoleType model for UI
class RoleType {
  code: number;
  label: string;
  description: string;
  groups = [];
  checked: boolean;
}
