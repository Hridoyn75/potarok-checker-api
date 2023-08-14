//GetAllReports, GetSingleReport, CreateReport, DeleteReport, EditReport

import db from "../db.js";

// CREATE NEW REPORT
export const CreateReport = (req, res) =>{
    const { title, description,company,amount, photos } = req.body;
    const currentUserID = req.user;

    const q = "INSERT INTO reports(title, description, photos, company, amount, userID) VALUES (?)";
    const values = [ title,description,photos,company, amount, currentUserID];
    db.query(q, [values], (err, data)=>{
        if (err) return res.json(err);
        res.json("Your report has been submitted");
    });
}

// GET ALL REPORTS
export const GetAllReports = (req, res) =>{
    const q = "SELECT * FROM reports ORDER BY id DESC";
    db.query(q, (err, data)=>{
        if (err) return res.json(err);
        res.json(data);
    });
}

// GET ALL REPORTS CREATED BY PERTICULAR USER
export const GetUserReports= (req, res) =>{
    const currentUser = req.user;
    const q = 'SELECT * FROM reports WHERE userID = ?'
    db.query(q, [currentUser], (err, data)=>{
        if(err) return res.status(400).json("Can not find user's reports");
        res.json(data);
    })
}

// GET SINGLE REPORT
export const GetSingleReport = (req, res) =>{
    const reportID = req.params.id;
    const q = `SELECT * FROM reports WHERE id = ? `;
    db.query(q, [reportID, reportID], (err, report)=>{
        if (err) return res.status(400).json(err);
        if(report.length === 0) return res.status(404).
        json({error: "This report is not Available"});

        const q2 = `SELECT * FROM comments 
        JOIN users ON creatorID = users.id WHERE parent = ?
        ORDER BY comments.id DESC`
        db.query(q2, [reportID], (err, comments) => {
            if (err) return res.status(400).json(err);
            res.json({"report": report, "comments": comments});
        })
        
    });
}

// DELETE SINGLE REPORT
export const DeleteReport = (req, res) =>{
    const reportID = req.params.id;
    const currentUser = req.user;
    const q = "DELETE FROM reports WHERE reports.userID = ? and reports.id = ?";
    db.query(q, [currentUser, reportID], (err, data)=>{
        if (err) return res.json(err);
        if(data.affectedRows === 0) return res.status(404).
        json("You are not allowed to delete this report");
        res.json("This report has been deleted");
    });
}


// UPDATE SINGLE REPORT
export const UpdateReport = (req, res) =>{
    const reportID = req.params.id;
    const currentUser = req.user;
    const { title, description, photos } = req.body;

    const q = `UPDATE reports SET title = ?, description = ?,
     photos = ? WHERE id = ? AND userID = ?`;
    db.query(q, [title, description, photos, reportID, currentUser ], (err, data)=>{
        if (err) return res.status(400).json(err);
        if(data.affectedRows === 0) return res.status(404).
        json("Failed to update this report!");
        res.json("This report has been Updated!");
    });
}


// CREATE COMMENT
export const CreateComment = (req, res) => {
    const currentUser = req.user;
    const { parentPostID, text } = req.body;

    const q = "INSERT INTO comments (parent, text, creatorID) VALUES(?)"

    db.query(q, [[parentPostID, text, currentUser]], (err, data) => {
        if (err) return res.status(400).json(err);
        res.status(201).json("Comment Added!");
    })

};

