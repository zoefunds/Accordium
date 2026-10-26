"""Pure protocol rules shared by tests and the deployable contract design."""
from dataclasses import dataclass
from enum import Enum

class Verdict(str, Enum):
    HOLDS = "HOLDS"
    WEAKENED = "WEAKENED"
    ABSENT = "ABSENT"
    INDETERMINATE = "INDETERMINATE"

class Resolution(str, Enum):
    CONTINUE = "CONTINUE"
    OPEN_REVIEW = "OPEN_REVIEW"
    REFUND = "REFUND"

@dataclass(frozen=True)
class Observation:
    source: str
    digest: str
    verdict: Verdict

def unique_sources(observations: list[Observation]) -> dict[str, Observation]:
    """One vote per adapter. Duplicate source reports never amplify a result."""
    return {item.source: item for item in observations}

def evidence_verdict(observations: list[Observation], quorum: int) -> Verdict:
    votes = unique_sources(observations)
    if len(votes) < quorum:
        return Verdict.INDETERMINATE
    counts = {verdict: 0 for verdict in Verdict}
    for item in votes.values():
        counts[item.verdict] += 1
    winner = max(counts, key=counts.get)
    if counts[winner] < quorum:
        return Verdict.INDETERMINATE
    return winner

def next_resolution(verdict: Verdict, breach_run: int, required_run: int,
                    indeterminate_rounds: int, max_indeterminate_rounds: int) -> Resolution:
    if verdict in (Verdict.WEAKENED, Verdict.ABSENT) and breach_run + 1 >= required_run:
        return Resolution.OPEN_REVIEW
    if verdict == Verdict.INDETERMINATE and indeterminate_rounds + 1 >= max_indeterminate_rounds:
        return Resolution.REFUND
    return Resolution.CONTINUE

def conservation(stake: int, challenge_bond: int, paid: int, returned: int) -> bool:
    return stake + challenge_bond == paid + returned
