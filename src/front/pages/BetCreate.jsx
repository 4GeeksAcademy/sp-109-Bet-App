import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BetCreate = () => {
	const [form, setForm] = useState({
		name: "",
		amount: 0,
		deadline: "",
		type: "sports",
		event_description: "",
		sport: "football",
		league: ""
	});
	const [leagues, setLeagues] = useState([]);
	const [matches, setMatches] = useState([]);
	const [loadingLeagues, setLoadingLeagues] = useState(false);
	const [loadingMatches, setLoadingMatches] = useState(false);
	const [otherBet, setOtherBet] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (form.sport === "football") fetchFootballLeagues();
	}, [form.sport]);

	useEffect(() => {
		if (form.league) fetchUpcomingMatches();
	}, [form.league]);

	const fetchFootballLeagues = async () => {
		setLoadingLeagues(true);
		setError(null);
		try {
			const token = localStorage.getItem("token");
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/football/competitions`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!resp.ok) throw new Error("Error fetching leagues");
			const data = await resp.json();
			setLeagues(data.competitions);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoadingLeagues(false);
		}
	};

	const fetchUpcomingMatches = async () => {
		setLoadingMatches(true);
		setError(null);
		try {
			const token = localStorage.getItem("token");
			const resp = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/football/matches?competition=${form.league}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (!resp.ok) throw new Error("Error fetching matches");
			const data = await resp.json();
			setMatches(data.matches);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoadingMatches(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (form.type === "sports" && !form.event_description) {
			setError("Please select a match.");
			return;
		}

		if (form.type === "others" && !otherBet.trim()) {
			setError("Please describe your bet");
			return;
		}

		if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
			setError("Amount must be a positive number");
			return;
		}

		const finalForm = { ...form };
		if (form.type === "others") {
			finalForm.event_description = otherBet;
		}

		const token = localStorage.getItem("token");

		try {
			const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playground/${id}/bet`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(finalForm)
			});

			if (!resp.ok) {
				const data = await resp.json();
				throw new Error(data.msg || "Failed to create bet");
			}

			navigate(`/playground/${id}`, { state: { successMessage: "Bet created successfully!" } });
		} catch (err) {
			console.error(err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-5">
			<h2 className="mb-4">Create a New Bet</h2>

			{error && <div className="alert alert-danger">{error}</div>}

			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label className="form-label">Name</label>
					<input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
				</div>

				<div className="mb-3">
					<label className="form-label">Amount</label>
					<input
						type="number"
						className="form-control"
						value={form.amount}
						onChange={(e) => setForm({ ...form, amount: e.target.value === "" ? "" : parseFloat(e.target.value) })}
						required
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Deadline</label>
					<input
						type="datetime-local"
						className="form-control"
						value={form.deadline}
						onChange={(e) => setForm({ ...form, deadline: e.target.value })}
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Type</label>
					<select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
						<option value="sports">Sports</option>
						<option value="others">Others</option>
					</select>
				</div>

				{form.type === "sports" && (
					<>
						<div className="mb-3">
							<label className="form-label">Sport</label>
							<select
								className="form-select"
								value={form.sport}
								onChange={(e) => setForm({ ...form, sport: e.target.value, league: "", event_description: "" })}
								disabled={loadingLeagues}
							>
								<option value="football">Football</option>
							</select>
						</div>

						<div className="mb-3">
							<label className="form-label">League</label>
							<select
								className="form-select"
								value={form.league}
								onChange={(e) => setForm({ ...form, league: e.target.value, event_description: "" })}
								disabled={loadingLeagues || leagues.length === 0}
							>
								<option value="">Select a league</option>
								{leagues.map((league) => (
									<option key={league.id} value={league.code}>
										{league.name} ({league.area.name})
									</option>
								))}
							</select>
							{loadingLeagues && <small className="text-muted">Loading leagues...</small>}
						</div>

						{form.league && (
							<div className="mb-3">
								<label className="form-label">Upcoming Matches</label>
								{loadingMatches ? (
									<div className="text-center py-3">
										<div className="spinner-border text-primary" role="status">
											<span className="visually-hidden">Loading...</span>
										</div>
									</div>
								) : matches.length > 0 ? (
									<select
										className="form-select"
										value={form.event_description}
										onChange={(e) => setForm({ ...form, event_description: e.target.value })}
										required
									>
										<option value="">Select a match</option>
										{matches.map((match) => (
											<option
												key={match.id}
												value={`${match.homeTeam.shortName} vs ${match.awayTeam.shortName} on ${new Date(match.utcDate).toLocaleDateString()}`}
											>
												{new Date(match.utcDate).toLocaleDateString()} - {match.homeTeam.shortName} vs {match.awayTeam.shortName}
											</option>
										))}
									</select>
								) : (
									<div className="alert alert-info">No upcoming matches found for this league.</div>
								)}
							</div>
						)}
					</>
				)}

				{form.type === "others" && (
					<div className="mb-3">
						<label className="form-label">What is your bet?</label>
						<input
							type="text"
							className="form-control me-2"
							placeholder="Type your bet"
							value={otherBet}
							onChange={(e) => setOtherBet(e.target.value)}
							required
						/>
					</div>
				)}

				<button type="submit" className="btn btn-primary" disabled={loading}>
					{loading ? "Creating..." : "Create bet"}
				</button>

				<button type="button" className="btn btn-danger mx-2" onClick={() => navigate(`/playground/${id}`)} disabled={loading}>
					Cancel
				</button>
			</form>
		</div>
	);
};
