package com.example.kinoprokat.services;

import com.example.kinoprokat.models.TheaterReport;

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
}
