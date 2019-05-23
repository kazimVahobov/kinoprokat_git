import {Injectable} from '@angular/core';
import {
  DistributorReportService,
  DistributorService,
  MovieService,
  RegionService,
  TheaterReportService,
  TheaterService
} from ".";
import {combineLatest, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {TheaterReportModel} from "../models";

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  currentUser = JSON.parse(localStorage.getItem('user'));
  months = [
    {
      name: 'Январь',
      value: 0
    },
    {
      name: 'Февраль',
      value: 1
    },
    {
      name: 'Март',
      value: 2
    },
    {
      name: 'Апрель',
      value: 3
    },
    {
      name: 'Май',
      value: 4
    },
    {
      name: 'Июнь',
      value: 5
    },
    {
      name: 'Июль',
      value: 6
    },
    {
      name: 'Август',
      value: 7
    },
    {
      name: 'Сентябрь',
      value: 8
    },
    {
      name: 'Октябрь',
      value: 9
    },
    {
      name: 'Ноябрь',
      value: 10
    },
    {
      name: 'Декабрь',
      value: 11
    },
  ];

  colors: any = {
    domain: [
      '#3f51b5',
      '#e91e63',
      '#03a9f4',
      '#9c27b0',
      '#2196f3',
      '#ffc107',
      '#ff5722',
      '#9c27b0',
      '#f44336',
      '#00bcd4',
      '#009688',
      '#4caf50',
      '#673ab7',
      '#8bc34a',
      '#ff9800']
  };

  constructor(private regionService: RegionService,
              private theaterService: TheaterService,
              private movieService: MovieService,
              private distributorService: DistributorService,
              private distReportService: DistributorReportService,
              private thReportService: TheaterReportService) {
  }

  filterByMovieId(movieId: string, distId?: string, theaterId?: string): Observable<MainFilter[]> {
    let combineRequests;

    if (distId && !theaterId) {
      combineRequests = combineLatest(
        this.thReportService.getByFilter(true, true),
        this.distReportService.getByDistId(distId),
        this.theaterService.getByDistId(distId),
      );
    } else if (distId && theaterId) {
      combineRequests = combineLatest(
        this.thReportService.getByTheaterId(theaterId)
      );
    } else if (!distId && !theaterId) {
      combineRequests = combineLatest(
        this.thReportService.getByFilter(true, true),
        this.distReportService.getByFilter(true, true),
        this.theaterService.getAll(),
        this.distributorService.getAll()
      );
    }

    return combineRequests.pipe(
      map(([_allThReports, _allDistReports, _theaters, _distributors]) => {
        let mapOfReports = new Map<string, any[]>();
        let listOfReports: MainFilter[] = [];
        let reportsOfCurrentMovie: Report[] = [];

        if (distId && !theaterId) {
          reportsOfCurrentMovie.push(...this.selectingOfReports(_allThReports, _theaters, movieId, true));
          let result: any[] = [];
          _allDistReports.filter(item => item.sent && item.confirm).forEach(item1 => {
            if (item1.distId === distId) {
              result.push({
                date: item1.date,
                sessions: item1.mobileTheaters.filter(session => session.movieId === movieId)
              });
            }
          });
          reportsOfCurrentMovie.push(...result);
        } else if (distId && theaterId) {
          let result: any[] = [];
          _allThReports.filter(item => item.sent && item.confirm).forEach(item1 => {
            result.push({
              date: item1.date,
              sessions: item1.withCont.filter(session => session.movieId === movieId)
            });
          });
          reportsOfCurrentMovie.push(...result);
        } else if (!distId && !theaterId) {
          reportsOfCurrentMovie.push(...this.selectingOfReports(_allThReports, _theaters, movieId, true));
          reportsOfCurrentMovie.push(...this.selectingOfReports(_allDistReports, _distributors, movieId, false));
        }

        reportsOfCurrentMovie
          .filter(item => item.sessions.length != 0)
          .sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            let result = 0;
            if (aDate > bDate) {
              result = -1;
            }
            if (aDate < bDate) {
              result = 1;
            }
            return result;
          })
          .forEach(report => {
            let keyByDate = this.generateKeyByDate(report.date);

            if (mapOfReports.has(keyByDate)) {
              mapOfReports.get(keyByDate).push(...report.sessions);
            } else {
              mapOfReports.set(keyByDate, report.sessions);
            }
          });

        mapOfReports.forEach((value, key) => {
          let dayChildTicketCount = 0;
          let dayAdultTicketCount = 0;
          let dayChildTicketSum = 0;
          let dayAdultTicketSum = 0;

          let eveningChildTicketCount = 0;
          let eveningAdultTicketCount = 0;
          let eveningChildTicketSum = 0;
          let eveningAdultTicketSum = 0;

          value.forEach(item => {
              if (item.daySession) {
                dayChildTicketCount += item.childTicketCount;
                dayAdultTicketCount += item.adultTicketCount;
                dayChildTicketSum += item.childTicketCount * item.childTicketPrice;
                dayAdultTicketSum += item.adultTicketCount * item.adultTicketPrice;
              } else {
                eveningChildTicketCount += item.childTicketCount;
                eveningAdultTicketCount += item.adultTicketCount;
                eveningChildTicketSum += item.childTicketCount * item.childTicketPrice;
                eveningAdultTicketSum += item.adultTicketCount * item.adultTicketPrice;
              }

            }
          );
          listOfReports.push({
            label: key,
            daySession: {
              childCount: dayChildTicketCount,
              childSum: dayChildTicketSum,
              adultCount: dayAdultTicketCount,
              adultSum: dayAdultTicketSum
            },
            eveningSession: {
              childCount: eveningChildTicketCount,
              childSum: eveningChildTicketSum,
              adultCount: eveningAdultTicketCount,
              adultSum: eveningAdultTicketSum
            }
          });


        });
        if (listOfReports.length != 0) {
          return listOfReports;
        } else {
          return [];
        }
      }));
  }

  getMoviesByTheaterId(theaterId: string, year?: number, month?: number): Observable<any[]> {
    let combineMovieRequests = combineLatest(this.thReportService.getByTheaterId(theaterId));

    return combineMovieRequests.pipe(
      map(([_reports]) => {
        let tempMoviesId: string[] = [];
        _reports = _reports.filter(report => report.sent && report.confirm);
        if (year) {
          _reports = _reports.filter(report => new Date(report.date).getFullYear().toString() === year.toString());
          if (month != null) {
            _reports = _reports.filter(report => new Date(report.date).getMonth().toString() === month.toString());
          }
        }

        _reports.forEach(_report => {
          _report.withCont.forEach(session => {
            if (!tempMoviesId.some(item => item === session.movieId)) {
              tempMoviesId.push(session.movieId);
            }
          });
        });

        if (_reports.length != 0) {
          return tempMoviesId.map(movieId => {

            let dayChildTicketCount = 0;
            let dayAdultTicketCount = 0;
            let dayChildTicketSum = 0;
            let dayAdultTicketSum = 0;

            let eveningChildTicketCount = 0;
            let eveningAdultTicketCount = 0;
            let eveningChildTicketSum = 0;
            let eveningAdultTicketSum = 0;

            _reports.forEach(report => {
              report.withCont.forEach(session => {
                if (session.movieId === movieId) {
                  if (session.daySession) {
                    dayChildTicketCount += session.childTicketCount;
                    dayAdultTicketCount += session.adultTicketCount;
                    dayChildTicketSum += session.childTicketCount * session.childTicketPrice;
                    dayAdultTicketSum += session.adultTicketCount * session.adultTicketPrice;
                  } else {
                    eveningChildTicketCount += session.childTicketCount;
                    eveningAdultTicketCount += session.adultTicketCount;
                    eveningChildTicketSum += session.childTicketCount * session.childTicketPrice;
                    eveningAdultTicketSum += session.adultTicketCount * session.adultTicketPrice;
                  }
                }
              });
            });
            return {
              label: movieId,
              daySession: {
                childCount: dayChildTicketCount,
                childSum: dayChildTicketSum,
                adultCount: dayAdultTicketCount,
                adultSum: dayAdultTicketSum
              },
              eveningSession: {
                childCount: eveningChildTicketCount,
                childSum: eveningChildTicketSum,
                adultCount: eveningAdultTicketCount,
                adultSum: eveningAdultTicketSum
              }
            };

          });
        } else {
          return [];
        }
      }));
  }

  filterByOneDistId(distId: string): Observable<any[]> {

    return combineLatest(
      this.distReportService.getByDistId(distId),
      this.thReportService.getAll(),
      this.theaterService.getByDistId(distId)
    ).pipe(
      map(([_allDistReports, _allThReports, _allTheatersOfDist]) => {

        let mapOfReports = new Map<string, any[]>();
        let listOfReports: MainFilter[] = [];

        _allDistReports = _allDistReports.filter(report => report.sent && report.confirm);
        _allThReports = _allThReports.filter(report => report.sent && report.confirm);

        let filteredThReports: TheaterReportModel[] = [];
        _allTheatersOfDist.forEach(_theater => filteredThReports.push(..._allThReports.filter(report => report.theaterId === _theater._id)));

        let _reports: any[] = [];
        filteredThReports.forEach(_report => {
          _report.withCont.forEach(session => _reports.push({
            movieId: session.movieId,
            session: session
          }))
        });
        _allDistReports.forEach(_report => {
          _report.mobileTheaters.forEach(session => _reports.push({
            movieId: session.movieId,
            session: session
          }))
        });

        if (_reports.length != 0) {
          _reports.forEach(report => {
            let key = report.movieId;

            if (mapOfReports.has(key)) {
              mapOfReports.get(key).push(report.session);
            } else {
              let temp: any[] = [];
              temp.push(report.session);
              mapOfReports.set(key, temp);
            }
          });
          mapOfReports.forEach((value, key) => {
            let dayChildTicketCount = 0;
            let dayAdultTicketCount = 0;
            let dayChildTicketSum = 0;
            let dayAdultTicketSum = 0;

            let eveningChildTicketCount = 0;
            let eveningAdultTicketCount = 0;
            let eveningChildTicketSum = 0;
            let eveningAdultTicketSum = 0;

            value.forEach(item => {
                if (item.daySession) {
                  dayChildTicketCount += item.childTicketCount;
                  dayAdultTicketCount += item.adultTicketCount;
                  dayChildTicketSum += item.childTicketCount * item.childTicketPrice;
                  dayAdultTicketSum += item.adultTicketCount * item.adultTicketPrice;
                } else {
                  eveningChildTicketCount += item.childTicketCount;
                  eveningAdultTicketCount += item.adultTicketCount;
                  eveningChildTicketSum += item.childTicketCount * item.childTicketPrice;
                  eveningAdultTicketSum += item.adultTicketCount * item.adultTicketPrice;
                }

              }
            );
            listOfReports.push({
              label: key,
              daySession: {
                childCount: dayChildTicketCount,
                childSum: dayChildTicketSum,
                adultCount: dayAdultTicketCount,
                adultSum: dayAdultTicketSum
              },
              eveningSession: {
                childCount: eveningChildTicketCount,
                childSum: eveningChildTicketSum,
                adultCount: eveningAdultTicketCount,
                adultSum: eveningAdultTicketSum
              }
            });
          });
          return listOfReports;
        } else {
          return [];
        }
      })
    );

  }

  getMoviesByDate(year?: number, distId?: string, month?: number): Observable<any[]> {

    let combineRequests;

    if (!distId) {
      combineRequests = combineLatest(
        this.thReportService.getByFilter(true, true),
        this.distReportService.getByFilter(true, true)
      );
    } else if (distId) {
      combineRequests = combineLatest(
        this.thReportService.getByFilter(true, true),
        this.distReportService.getByDistId(distId),
        this.theaterService.getByDistId(distId)
      );
    }

    return combineRequests.pipe(
      map(([_allThReports, _allDistReports, _allTheaters]) => {
        let mapOfReports = new Map<string, any[]>();
        let listOfReports: MainFilter[] = [];
        let filteredThReports: TheaterReportModel[] = [];

        if (year) {
          _allThReports = _allThReports.filter(report => new Date(report.date).getFullYear() === year);
          _allDistReports = _allDistReports.filter(report => new Date(report.date).getFullYear() === year);
        }

        if (month != null) {
          _allThReports = _allThReports.filter(report => new Date(report.date).getMonth() === month);
          _allDistReports = _allDistReports.filter(report => new Date(report.date).getMonth() === month);
        }

        if (distId) {
          _allTheaters.forEach(_theater => filteredThReports.push(..._allThReports.filter(report => report.theaterId === _theater._id)));
          _allThReports = filteredThReports;
        }

        let _reports: any[] = [];
        if (_allThReports) {
          _allThReports.forEach(_report => {
            _report.withCont.forEach(session => _reports.push({
              movieId: session.movieId,
              session: session
            }))
          });
        }
        if (_allDistReports) {
          _allDistReports.forEach(_report => {
            _report.mobileTheaters.forEach(session => _reports.push({
              movieId: session.movieId,
              session: session
            }))
          });
        }

        if (_reports.length != 0) {
          _reports.forEach(report => {
            let key = report.movieId;

            if (mapOfReports.has(key)) {
              mapOfReports.get(key).push(report.session);
            } else {
              let temp: any[] = [];
              temp.push(report.session);
              mapOfReports.set(key, temp);
            }
          });
          mapOfReports.forEach((value, key) => {
            let dayChildTicketCount = 0;
            let dayAdultTicketCount = 0;
            let dayChildTicketSum = 0;
            let dayAdultTicketSum = 0;

            let eveningChildTicketCount = 0;
            let eveningAdultTicketCount = 0;
            let eveningChildTicketSum = 0;
            let eveningAdultTicketSum = 0;

            value.forEach(item => {
                if (item.daySession) {
                  dayChildTicketCount += item.childTicketCount;
                  dayAdultTicketCount += item.adultTicketCount;
                  dayChildTicketSum += item.childTicketCount * item.childTicketPrice;
                  dayAdultTicketSum += item.adultTicketCount * item.adultTicketPrice;
                } else {
                  eveningChildTicketCount += item.childTicketCount;
                  eveningAdultTicketCount += item.adultTicketCount;
                  eveningChildTicketSum += item.childTicketCount * item.childTicketPrice;
                  eveningAdultTicketSum += item.adultTicketCount * item.adultTicketPrice;
                }

              }
            );
            listOfReports.push({
              label: key,
              daySession: {
                childCount: dayChildTicketCount,
                childSum: dayChildTicketSum,
                adultCount: dayAdultTicketCount,
                adultSum: dayAdultTicketSum
              },
              eveningSession: {
                childCount: eveningChildTicketCount,
                childSum: eveningChildTicketSum,
                adultCount: eveningAdultTicketCount,
                adultSum: eveningAdultTicketSum
              }
            });
          });
          return listOfReports;
        } else {
          return [];
        }

      })
    );

  }

  getMoviesWithNameByThReports(theaterId: string): Observable<any[]> {
    let combineMovieRequests = combineLatest(
      this.thReportService.getByTheaterId(theaterId), this.movieService.getAll());

    return combineMovieRequests.pipe(
      map(([_reports, _movies]) => {
        let tempMoviesId: string[] = [];
        _reports.filter(report => report.sent && report.confirm)
          .forEach(_report => {
            _report.withCont.forEach(session => {
              if (!tempMoviesId.some(item => item === session.movieId)) {
                tempMoviesId.push(session.movieId);
              }
            });
          });
        if (tempMoviesId.length != 0) {
          return tempMoviesId.map(movieId => {
            return {
              _id: movieId,
              name: _movies.find(item => item._id === movieId).name
            };
          });
        } else {
          return [];
        }

      }));

  }

  getMoviesWithNameByDistId(distId: string): Observable<any[]> {
    let combineMovieRequests = combineLatest(
      this.thReportService.getByFilter(true, true),
      this.distReportService.getByDistId(distId),
      this.theaterService.getByDistId(distId),
      this.movieService.getAll());

    return combineMovieRequests.pipe(
      map(([_thReports, _distReports, _theaters, _movies]) => {
        let tempMoviesId: string[] = [];

        _distReports.filter(report => report.sent && report.confirm)
          .forEach(_report => {
            _report.mobileTheaters.forEach(session => {
              if (!tempMoviesId.some(item => item === session.movieId)) {
                tempMoviesId.push(session.movieId);
              }
            });
          });

        let filteredThReports: TheaterReportModel[] = [];
        _theaters.forEach(_theater => filteredThReports.push(..._thReports.filter(report => report.theaterId === _theater._id)));

        filteredThReports.filter(report => report.sent && report.confirm)
          .forEach(_report => {
            _report.withCont.forEach(session => {
              if (!tempMoviesId.some(item => item === session.movieId)) {
                tempMoviesId.push(session.movieId);
              }
            });
          });

        if (tempMoviesId.length != 0) {
          return tempMoviesId.map(movieId => {
            return {
              _id: movieId,
              name: _movies.find(item => item._id === movieId).name
            };
          });
        } else {
          return [];
        }

      }));
  }

  getTheatersWithName(distId: string): Observable<any[]> {
    return combineLatest(
      this.theaterService.getByDistId(distId)
    ).pipe(
      map(([_theaters]) => {
        if (_theaters.length != 0) {
          return _theaters.map(theater => {
            return {
              _id: theater._id,
              name: theater.name
            }
          });
        } else {
          return [];
        }
      })
    );
  }

  getOverallDataOfMovie(movieId: string, distId?: string, theaterId?: string): Observable<any> {
    return this.filterByMovieId(movieId, distId, theaterId).pipe(
      map( reports => {
        let _totalTicketCount: number = 0;
        let _totalSum: number = 0;
        let temp: any[] = [];

        temp.push(...reports.map(item => {
          let _ticketCount: number = 0;
          let _sum: number = 0;
          _ticketCount += item.daySession.childCount + item.daySession.adultCount + item.eveningSession.childCount + item.eveningSession.adultCount;
          _sum += item.daySession.childSum + item.daySession.adultSum + item.eveningSession.childSum + item.eveningSession.adultSum;
          _totalTicketCount += _ticketCount;
          _totalSum += _sum;
          return {
            label: item.label,
            ticketCount: _ticketCount,
            sum: _sum
          }
        }));
        return {
          moviesData: temp,
          totalTicketCount: _totalTicketCount,
          totalSum: _totalSum
        }
      })
    );
  }

  getMovieDividedByDist(movieId: string): Observable<any[]> {
    return combineLatest(
      this.thReportService.getByFilter(true, true),
      this.distReportService.getByFilter(true, true),
      this.theaterService.getAll(),
      this.distributorService.getAll()
    ).pipe(
      map (([_thReports, _distReports, _theaters, _distributors]) => {
        let distId: string[] = [];
        let theatersId: string[] = [];
        _distributors.forEach(item => {
          if (!distId.some(id => id == item._id)) {
            if (item.parentId) {
              distId.push(item._id);
            }
          }
        });
        _theaters.forEach(item => {
          if (!theatersId.some(id => id == item._id)) {
            theatersId.push(item._id);
          }
        });

        let filteredDistReports: any[] = [];
        distId.forEach(id => {
          _distReports.forEach(report => {
            if (report.distId === id) {
              report.mobileTheaters.forEach(session => {
                if (session.movieId === movieId) {
                  filteredDistReports.push({
                    distId: id,
                    movieId: movieId,
                    ticketCount: session.childTicketCount + session.adultTicketCount,
                    sum: (session.childTicketCount * session.childTicketPrice) + (session.adultTicketCount * session.adultTicketPrice)
                  });
                }
              });
            }
          });
        });

        let filteredThReports: any[] = [];
        theatersId.forEach(id => {
          _thReports.forEach(report => {
            if (report.theaterId === id) {
              let distId = _theaters.find(theater => theater._id === id).distId;
              report.withCont.forEach(session => {
                if (session.movieId === movieId) {
                  filteredThReports.push({
                    theaterId: id,
                    distId: distId,
                    movieId: movieId,
                    ticketCount: session.childTicketCount + session.adultTicketCount,
                    sum: (session.childTicketCount * session.childTicketPrice) + (session.adultTicketCount * session.adultTicketPrice)
                  });
                }
              });
            }
          });
        });

        // if (filteredDistReports.length != 0 && filteredThReports.length != 0) {
          return distId.map(distId => {
            let _ticketCount: number = 0;
            let _sum: number = 0;
            if (filteredDistReports.length != 0) {
              filteredDistReports.forEach(distReport => {
                if (distReport.distId === distId) {
                  _ticketCount += distReport.ticketCount;
                  _sum += distReport.sum;
                }
              });
            }

            if (filteredThReports.length != 0) {
              filteredThReports.forEach(thReport => {
                if (thReport.distId === distId) {
                  _ticketCount += thReport.ticketCount;
                  _sum += thReport.sum;
                }
              });
            }
            return {
              label: _distributors.find(item => item._id === distId).name,
              movieId: movieId,
              ticketCount: _ticketCount,
              sum: _sum
            }
          });

    }));
  }

  private selectingOfReports(arr1: any[], arr2: any[], selectId: string, isTheater: boolean): any[] {
    let result: any[] = [];
    let idType = isTheater ? 'theaterId' : 'distId';
    let subItem = isTheater ? 'withCont' : 'mobileTheaters';
    arr1.forEach(item1 => {
      arr2.forEach(item2 => {
        if (item1[idType] === item2._id) {
          result.push({
            date: item1.date,
            sessions: item1[subItem].filter(session => session.movieId === selectId)
          });
        }
      });
    });
    return result;
  }

  generateKeyByDate(value: any): string {
    let result: string;
    let date = new Date(value).getDate().toString();
    if (date.length === 1) {
      date = '0' + date;
    }
    let month = (new Date(value).getMonth() + 1).toString();
    if (month.length === 1) {
      month = '0' + month;
    }
    let year = new Date(value).getFullYear().toString();
    result = date + '.' + month + '.' + year + ' г.';
    return result;
  }
}

class Report {
  date: Date;
  sessions: any[] = [];
}

class MainFilter {
  label: string;
  daySession?: SessionOfDetailFilter = new SessionOfDetailFilter();
  eveningSession?: SessionOfDetailFilter = new SessionOfDetailFilter();
}

class SessionOfDetailFilter {
  childCount: number;
  childSum: number;
  adultCount: number;
  adultSum: number;
}
