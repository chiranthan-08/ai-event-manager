import Decoration from '../models/Decoration.js';

export const getDecorations = async (req, res) => {
  try {
    const { category, decorationType, event, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (decorationType) filter.decorationType = decorationType;
    if (event) filter.event = event;

    const total = await Decoration.countDocuments(filter);
    const decorations = await Decoration.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('event', 'title date venue location category')
      .select('+priceRange +duration +capacity +venue +rating +reviews +includes +designs +contact');

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

export const getDecorationById = async (req, res) => {
  try {
    const decoration = await Decoration.findById(req.params.id)
      .populate('event', 'title date venue location category description')
      .select('+priceRange +duration +capacity +venue +rating +reviews +includes +designs +contact');
    if (!decoration) {
      return res.status(404).json({ success: false, message: 'Decoration not found' });
    }
    res.status(200).json({ success: true, decoration });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createDecoration = async (req, res) => {
  try {
    const { title, description, category, decorationType, image, event, priceRange, includes, designs } = req.body;

    const decoration = await Decoration.create({
      title,
      description,
      category,
      decorationType: decorationType || 'Other',
      image,
      event,
      priceRange: priceRange || '',
      includes: includes || [],
      designs: designs || [],
    });

    res.status(201).json({ success: true, decoration });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateDecoration = async (req, res) => {
  try {
    const decoration = await Decoration.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!decoration) {
      return res.status(404).json({ success: false, message: 'Decoration not found' });
    }
    res.status(200).json({ success: true, decoration });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteDecoration = async (req, res) => {
  try {
    const decoration = await Decoration.findByIdAndDelete(req.params.id);
    if (!decoration) {
      return res.status(404).json({ success: false, message: 'Decoration not found' });
    }
    res.status(200).json({ success: true, message: 'Decoration deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
