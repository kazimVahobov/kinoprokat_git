package com.example.kinoprokat.services;

import com.example.kinoprokat.models.ReportWithCont;
import com.example.kinoprokat.models.TheaterReport;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class TheaterReportService {

    private static TheaterReportService mInstance;

    public static TheaterReportService getInstance() {
        if (mInstance == null) {
            mInstance = new TheaterReportService();
        }
        return mInstance;
    }

    public int defineReportStatusByDate(List<TheaterReport> reports, Date date) {
        int result = 0;
        Calendar currentCalendar = Calendar.getInstance();
        currentCalendar.setTime(date);
        Calendar reportCalendar = Calendar.getInstance();
        for (TheaterReport report : reports) {
            reportCalendar.setTime(report.getDate());
            if (currentCalendar.get(Calendar.YEAR) == reportCalendar.get(Calendar.YEAR) && currentCalendar.get(Calendar.DAY_OF_YEAR) == reportCalendar.get(Calendar.DAY_OF_YEAR)) {
                result = defineReportStatus(report);
            }
        }
        return result;
    }

    public int defineReportStatus(TheaterReport report) {
        int result = 1;
        if (report.isSent() && !report.isConfirm()) {
            result = 2;
        } else if (report.isSent() && report.isConfirm()) {
            result = 3;
        }
        return result;
    }

    public int getMoviesCountFromReports(List<TheaterReport> reports) {
        List<TheaterReport> filteredReports = new ArrayList<>();
        for (TheaterReport report : reports) {
            if (report.isSent() && report.isConfirm()) filteredReports.add(report);
        }
        List<String> moviesId = new ArrayList<>();
        if (filteredReports.size() > 0) {
            for (TheaterReport report : filteredReports) {
                for (ReportWithCont session : report.getWithCont()) {
                    if (!moviesId.contains(session.getMovieId()))
                        moviesId.add(session.getMovieId());
                }
            }
            return moviesId.size();
        } else return 0;
    }

    public int getSessionsCountFromReports(List<TheaterReport> reports) {
        List<TheaterReport> filteredReports = new ArrayList<>();
        for (TheaterReport report : reports) {
            if (report.isSent() && report.isConfirm()) filteredReports.add(report);
        }
        int sessions = 0;
        if (filteredReports.size() > 0) {
            for (TheaterReport report : filteredReports) {
                sessions += report.getWithCont().size();
            }
            return sessions;
        } else return 0;
    }

    public int getTicketsCountFromReports(List<TheaterReport> reports) {
        List<TheaterReport> filteredReports = new ArrayList<>();
        for (TheaterReport report : reports) {
            if (report.isSent() && report.isConfirm()) filteredReports.add(report);
        }
        int tickets = 0;
        if (filteredReports.size() > 0) {
            for (TheaterReport report : filteredReports) {
                for (ReportWithCont session : report.getWithCont()) {
                    tickets += session.getAdultTicketCount() + session.getChildTicketCount();
                }
            }
            return tickets;
        } else return 0;
    }
}
