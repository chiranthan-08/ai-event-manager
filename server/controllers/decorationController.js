import Decoration from '../models/Decoration.js';

export const getDecorations = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (category) filter.category = category;

    const total = await Decoration.countDocuments(filter);

    const decorations = await Decoration.find(filter)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: decorations.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      decorations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createDecoration = async (req, res) => {
  try {
    const { title, description, category, imageUrl, price, tags } = req.body;

    const decoration = await Decoration.create({
      title,
      description,
      category,
      imageUrl,
      price,
      tags,
      addedBy: req.user.id,
    });

    const populated = await Decoration.findById(decoration._id)
      .populate('addedBy', 'name email');

    res.status(201).json({ success: true, decoration: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteDecoration = async (req, res) => {
  try {
    const decoration = await Decoration.findById(req.params.id);

    if (!decoration) {
      return res.status(404).json({ success: false, message: 'Decoration not found' });
    }

    await Decoration.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Decoration deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
