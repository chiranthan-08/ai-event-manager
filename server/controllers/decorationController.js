import db from '../utils/memoryDb.js';

export const getDecorations = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const allDecorations = db.findDecorations(category);
    const total = allDecorations.length;
    const skip = (Number(page) - 1) * Number(limit);
    const paginated = allDecorations.slice(skip, skip + Number(limit));

    const enriched = paginated.map((dec) => {
      const addedBy = dec.addedBy ? db.findUserById(dec.addedBy) : null;
      return { ...dec, addedBy };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      decorations: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createDecoration = async (req, res) => {
  try {
    const { title, description, category, imageUrl, price, tags } = req.body;

    const decoration = db.createDecoration({
      title,
      description,
      category,
      imageUrl,
      price,
      tags,
      addedBy: req.user.id,
    });

    const addedBy = db.findUserById(req.user.id);
    res.status(201).json({ success: true, decoration: { ...decoration, addedBy } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteDecoration = async (req, res) => {
  try {
    const deleted = db.deleteDecoration(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Decoration not found' });
    }

    res.status(200).json({ success: true, message: 'Decoration deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
