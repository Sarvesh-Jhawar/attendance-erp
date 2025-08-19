package com.tech.ProjectBunk.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.ArrayList;

public class DatewiseAttendanceEntry {
    @JsonProperty("date")
    private String date;

    @JsonProperty("periods")
    private List<String> periods;

    public DatewiseAttendanceEntry() {
        // Initialize with safe defaults to prevent null pointer exceptions
        this.date = "";
        this.periods = new ArrayList<>();
    }

    public DatewiseAttendanceEntry(String date, List<String> periods) {
        this.date = (date != null) ? date : "";
        this.periods = (periods != null) ? periods : new ArrayList<>();
    }

    public String getDate() {
        return (date != null) ? date : "";
    }

    public void setDate(String date) {
        this.date = (date != null) ? date : "";
    }

    public List<String> getPeriods() {
        return (periods != null) ? periods : new ArrayList<>();
    }

    public void setPeriods(List<String> periods) {
        this.periods = (periods != null) ? periods : new ArrayList<>();
    }
} 