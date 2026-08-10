import math
from datetime import datetime, date

class ProjectPlanningEngine:
    """
    Core calculation engine for SMS Group Capacity Planning.
    Handles month-by-month distribution logic for project tasks.
    """

    @staticmethod
    def add_months(sourcedate: date, months: int) -> date:
        """Helper to add months to a datetime.date object."""
        month = sourcedate.month - 1 + months
        year = sourcedate.year + month // 12
        month = month % 12 + 1
        day = min(sourcedate.day, [31, 29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month-1])
        return date(year, month, day)

    @classmethod
    def calculate_welding_monthly_distribution(cls, allocated_hours: float, duration_months: int, start_date_str: str = None) -> list:
        """
        Calculates monthly hour breakdown for Welding based on the 15% rule:
        - Month 1: Exactly 15% of total allocated hours.
        - Remaining Months (Months 2 to N): Remaining 85% split equally.
        
        Returns a list of dicts:
        [
          {
            "month_index": 1,
            "month_label": "Aug 2026",
            "date": "2026-08-01",
            "hours": 750.0,
            "percentage": 15.0
          },
          ...
        ]
        """
        if allocated_hours <= 0 or duration_months <= 0:
            return []

        # Parse start_date
        start_dt = date(2026, 8, 1) # Default Aug 2026
        if start_date_str:
            try:
                if isinstance(start_date_str, date):
                    start_dt = start_date_str
                else:
                    start_dt = datetime.strptime(str(start_date_str)[:10], "%Y-%m-%d").date()
            except ValueError:
                pass

        monthly_breakdown = []
        allocated_hours = float(allocated_hours)
        duration_months = int(duration_months)

        if duration_months == 1:
            # Single month receives 100% of hours
            m_date = cls.add_months(start_dt, 0)
            monthly_breakdown.append({
                "month_index": 1,
                "month_label": m_date.strftime("%b %Y"),
                "date": m_date.strftime("%Y-%m-%d"),
                "hours": round(allocated_hours, 2),
                "percentage": 100.0
            })
            return monthly_breakdown

        # 1. Month 1: 15% of total planned hours
        month_1_hours = round(allocated_hours * 0.15, 2)
        month_1_pct = 15.0

        # 2. Remaining 85% split equally among remaining (duration_months - 1) months
        remaining_hours = allocated_hours - month_1_hours
        remaining_months_count = duration_months - 1
        
        base_remaining_hours_per_month = round(remaining_hours / remaining_months_count, 2)

        # Add Month 1
        m1_date = cls.add_months(start_dt, 0)
        monthly_breakdown.append({
            "month_index": 1,
            "month_label": m1_date.strftime("%b %Y"),
            "date": m1_date.strftime("%Y-%m-%d"),
            "hours": month_1_hours,
            "percentage": month_1_pct
        })

        # Add Remaining Months
        accumulated_hours = month_1_hours
        for idx in range(1, duration_months):
            m_date = cls.add_months(start_dt, idx)
            
            # On final month, adjust for any small floating rounding differences to ensure exact total
            if idx == duration_months - 1:
                m_hours = round(allocated_hours - accumulated_hours, 2)
            else:
                m_hours = base_remaining_hours_per_month
                
            accumulated_hours += m_hours
            m_pct = round((m_hours / allocated_hours) * 100.0, 2)

            monthly_breakdown.append({
                "month_index": idx + 1,
                "month_label": m_date.strftime("%b %Y"),
                "date": m_date.strftime("%Y-%m-%d"),
                "hours": m_hours,
                "percentage": m_pct
            })

        return monthly_breakdown
