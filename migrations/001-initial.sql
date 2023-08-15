--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE Score (
	messageId TEXT NOT NULL,
	userId TEXT NOT NULL,
	username TEXT NOT NULL,
	points INTEGER NOT NULL,
	PRIMARY KEY(messageId, userId)
);

CREATE TABLE Setting (
	setting TEXT PRIMARY KEY,
	value TEXT
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE Score;
DROP TABLE Setting;
