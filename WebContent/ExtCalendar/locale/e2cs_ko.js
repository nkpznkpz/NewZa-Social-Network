// --------------------------------------------------
// E2CS  Extjs-Event-Calendar-Solution  alpha(0.0.9) 
// @Version E2CS-0.0.9  june 27 2008 
// Korean
// @Author- translation: Michael Kim
// @contact:
// --------------------------------------------------

Ext.namespace('e2cs.cal_locale');
e2cs.cal_locale={
    dateSelectorText:    '날짜 변경',
    dateSelectorTooltip: '선택한 날짜로 이동',
    monthtitles:["1월",     "2월",  "3월",
                 "4월",     "5월",  "6월",
                 "7월",     "8월",  "9월",
                 "10월",    "11월", "12월"],
    daytitles:  ["일요일",  "월요일",    
                 "화요일",  "수요일","목요일",   
                 "금요일",  "토요일"],
    
    todayLabel: '오늘',
    todayToolTip: '오늘로 이동',
    
    tooltipMonthView:   '월간 일정',
    tooltipWeekView:    '주간 일정',    
    tooltipDayView:     '일일 일정',    

    cal_time_format: '오전',
    cal_ampm_am: '오전',
    cal_ampm_pm: '오후',
    cal_title_format:  'Y-m',
    cal_etc_format:  'm-d',
    cal_week_title: 'Y m d (l)',
    
    win_tasks_format:  'Y-m-d',
    win_tasks_loading: '읽는중...',
    win_tasks_empty:   '일정이 없습니다.',
    win_month_zoomlabel:'이 날의 일정',
    headerTooltipsMonth: { 
        prev: '이전달', 
        next: '다음달' 
    },  
    contextMenuLabelsMonth: { 
        task: "새 일정 추가", 
        chgwview: "주간 일정으로 보기...", 
        chgdview: "일일 일정으로 보기...",
        gonextmonth: "다음달",
        goprevmonth: "이전달"

    },
    labelforTasksinMonth: '오늘의 일정:',
    task_MoreDaysFromTask: '<br/>(+)',
    task_LessDaysFromTask: '(-)<br/>',
    task_qtip_starts:   '시작: ',
    task_qtip_ends:     '완료: ',
    headerTooltipsDay: {
            prev: '이전날',
            next: '다음날'
    },
    contextMenuLabelsDay: {
        taskAdd: "새 일정",
        taskDelete: "일정 삭제",
        taskEdit: "일정 편집:",
        NextDay: "다음 일로 이동",
        PreviousDay: "이전 일로 이동",
        chgwview: "주간 일정 보기",
        chgmview: "월간 일정 보기"
    },
    contextMenuLabelsWeek: {
        prev: "이전 주로 이동.",
        next: "다음주로 이동.",
        chgdview: "일일 일정으로 보기",
        chgmview: "월간 일정으로 보기"
    },
    headerTooltipsWeek: {
        prev: '이전주',
        next: '다음주'
    },
    labelforTasksinWeek: '이 주의 이벤트:',
    win_week_zoomlabel:'모든 일정 보기',
    weekheaderlabel:'주 #',
    weekheaderlabel_from:'시작날짜:',
    weekheaderlabel_to:' 완료날짜:',
    alldayTasksMaxLabel:'모든(+) 일정을 표시 합니다.'
};

