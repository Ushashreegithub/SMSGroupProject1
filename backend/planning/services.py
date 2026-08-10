import math
from datetime import datetime, date

class ProjectPlanningEngine:
    """
    Core calculation engine for SMS Group Capacity Planning.
    Handles month-by-month distribution logic for project tasks,
    including 15% initial ramp-up, adjustments, and buffers.
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
    def calculate_welding_monthly_distribution(
        cls,
        allocated_hours: float,
        duration_months: int,
        start_date_str: str = None,
        adjustment_month_index: int = None,
        actual_utilized_hours: float = None,
        buffer_month_index: int = None,
        buffer_hours: float = 0.0
    ) -> list:
        """
        Calculates monthly hour breakdown for Welding with support for:
        1. 15% Month 1 ramp-up rule (baseline).
        2. Adjustment: Over/Under utilization in a month rolls difference into remaining months.
        3. Buffer: Extra capacity introduced into a specific month, expanding total task hours.
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

        allocated_hours = float(allocated_hours)
        duration_months = int(duration_months)
        buffer_hours = float(buffer_hours or 0.0)

        # Single month duration edge case
        if duration_months == 1:
            m_date = cls.add_months(start_dt, 0)
            final_hours = allocated_hours
            if actual_utilized_hours is not None and (adjustment_month_index == 1 or adjustment_month_index is None):
                final_hours = float(actual_utilized_hours)
            if buffer_month_index == 1 or buffer_hours > 0:
                final_hours += buffer_hours

            return [{
                "month_index": 1,
                "month_label": m_date.strftime("%b %Y"),
                "date": m_date.strftime("%Y-%m-%d"),
                "hours": round(final_hours, 2),
                "percentage": 100.0,
                "is_adjusted": actual_utilized_hours is not None,
                "is_buffer_added": buffer_hours > 0,
            }]

        # 1. BASELINE CALCULATION
        baseline_hours = []
        month_1_base = round(allocated_hours * 0.15, 2)
        remaining_base_total = allocated_hours - month_1_base
        remaining_count = duration_months - 1
        base_remaining_per_month = round(remaining_base_total / remaining_count, 2)

        baseline_hours.append(month_1_base)
        for i in range(1, duration_months):
            if i == duration_months - 1:
                # Last month rounding fix
                baseline_hours.append(round(allocated_hours - sum(baseline_hours), 2))
            else:
                baseline_hours.append(base_remaining_per_month)

        # 2. APPLY ADJUSTMENT (if provided)
        revised_hours = list(baseline_hours)
        has_adjustment = False
        adj_index = None

        if adjustment_month_index is not None and actual_utilized_hours is not None:
            try:
                adj_index = int(adjustment_month_index) - 1 # Convert 1-based to 0-based index
                if 0 <= adj_index < duration_months:
                    has_adjustment = True
                    planned_orig = revised_hours[adj_index]
                    actual_val = float(actual_utilized_hours)
                    diff = planned_orig - actual_val
                    revised_hours[adj_index] = actual_val

                    # Distribute diff equally across remaining subsequent months
                    subsequent_count = duration_months - (adj_index + 1)
                    if subsequent_count > 0:
                        add_per_month = round(diff / subsequent_count, 2)
                        accumulated_diff = 0.0
                        for k in range(adj_index + 1, duration_months):
                            if k == duration_months - 1:
                                revised_hours[k] = round(revised_hours[k] + (diff - accumulated_diff), 2)
                            else:
                                revised_hours[k] = round(revised_hours[k] + add_per_month, 2)
                                accumulated_diff += add_per_month
            except (ValueError, TypeError):
                pass

        # 3. APPLY BUFFER (if provided)
        buf_index = None
        has_buffer = False
        if buffer_month_index is not None and buffer_hours > 0:
            try:
                buf_index = int(buffer_month_index) - 1
                if 0 <= buf_index < duration_months:
                    has_buffer = True
                    revised_hours[buf_index] = round(revised_hours[buf_index] + buffer_hours, 2)
            except (ValueError, TypeError):
                pass

        # 4. BUILD RESPONSE OBJECTS
        total_effective_hours = sum(revised_hours)
        monthly_breakdown = []

        for idx in range(duration_months):
            m_date = cls.add_months(start_dt, idx)
            h = revised_hours[idx]
            pct = round((h / total_effective_hours) * 100.0, 2) if total_effective_hours > 0 else 0.0

            is_adj = (adj_index == idx) if has_adjustment else False
            is_buf = (buf_index == idx) if has_buffer else False

            monthly_breakdown.append({
                "month_index": idx + 1,
                "month_label": m_date.strftime("%b %Y"),
                "date": m_date.strftime("%Y-%m-%d"),
                "hours": h,
                "percentage": pct,
                "is_adjusted": is_adj,
                "is_buffer_added": is_buf,
                "buffer_hours_added": buffer_hours if is_buf else 0.0,
            })

        return monthly_breakdown
