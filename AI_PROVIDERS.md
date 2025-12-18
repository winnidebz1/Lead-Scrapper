# AI Providers Guide

BizDiscover AI now supports multiple AI providers for business discovery. You can use any of the following:

## Supported AI Providers

### 1. Google Gemini (Default)
- **API Key**: `GEMINI_API_KEY`
- **Get Key**: https://makersuite.google.com/app/apikey
- **Pricing**: Free tier available, generous limits
- **Model**: `gemini-3-flash-preview`
- **Pros**: Free tier, fast, good JSON output
- **Cons**: None for basic use

### 2. OpenAI GPT
- **API Key**: `OPENAI_API_KEY`
- **Get Key**: https://platform.openai.com/api-keys
- **Pricing**: Pay-as-you-go ($0.15-$0.60 per 1M tokens)
- **Model**: `gpt-4o-mini` (default, configurable)
- **Pros**: Most popular, excellent quality, reliable
- **Cons**: Requires paid account (no free tier)

**Available Models:**
- `gpt-4o-mini` - Fast and affordable (recommended)
- `gpt-4o` - Best quality, more expensive
- `gpt-3.5-turbo` - Cheaper alternative

### 3. Anthropic Claude
- **API Key**: `ANTHROPIC_API_KEY`
- **Get Key**: https://console.anthropic.com/
- **Pricing**: Pay-as-you-go
- **Model**: `claude-3-5-sonnet-20241022` (default, configurable)
- **Pros**: Excellent reasoning, great for structured outputs
- **Cons**: Requires paid account

**Available Models:**
- `claude-3-5-sonnet-20241022` - Best quality (recommended)
- `claude-3-opus-20240229` - Most capable
- `claude-3-haiku-20240307` - Fastest and cheapest

### 4. Cohere
- **API Key**: `COHERE_API_KEY`
- **Get Key**: https://dashboard.cohere.com/api-keys
- **Pricing**: Free tier available, then pay-as-you-go
- **Model**: `command` (default, configurable)
- **Pros**: Free tier, good for structured data
- **Cons**: Less popular than others

## Setup

### Quick Start (Choose One)

**Option 1: Google Gemini (Recommended for Free)**
```env
GEMINI_API_KEY=your_gemini_key_here
```

**Option 2: OpenAI GPT**
```env
OPENAI_API_KEY=your_openai_key_here
# Optional: Specify model
OPENAI_MODEL=gpt-4o-mini
```

**Option 3: Anthropic Claude**
```env
ANTHROPIC_API_KEY=your_anthropic_key_here
# Optional: Specify model
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

**Option 4: Cohere**
```env
COHERE_API_KEY=your_cohere_key_here
# Optional: Specify model
COHERE_MODEL=command
```

### Multiple Providers

You can configure multiple providers. The app will automatically use the best available one in this priority order:

1. Google Gemini
2. OpenAI GPT
3. Anthropic Claude
4. Cohere

If your preferred provider fails, it will automatically fall back to the next available one.

## Getting API Keys

### Google Gemini
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and add to `.env.local`

### OpenAI
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Add payment method (required)
4. Create API key
5. Copy and add to `.env.local`

**Note**: OpenAI requires a paid account. Minimum $5 credit.

### Anthropic Claude
1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Add payment method (required)
4. Create API key
5. Copy and add to `.env.local`

**Note**: Anthropic requires a paid account.

### Cohere
1. Visit https://dashboard.cohere.com/api-keys
2. Sign up or log in
3. Create API key (free tier available)
4. Copy and add to `.env.local`

## Comparison

| Provider | Free Tier | Cost | Quality | Speed | Best For |
|----------|-----------|------|---------|-------|----------|
| **Gemini** | ✅ Yes | Free | ⭐⭐⭐⭐ | Fast | Quick setup, free use |
| **OpenAI** | ❌ No | $$ | ⭐⭐⭐⭐⭐ | Fast | Best quality, reliability |
| **Claude** | ❌ No | $$ | ⭐⭐⭐⭐⭐ | Medium | Complex reasoning |
| **Cohere** | ✅ Yes | $ | ⭐⭐⭐ | Fast | Budget-friendly |

## Recommendations

### For Quick Start (Free)
- **Use Google Gemini** - Free tier, works immediately, good quality

### For Best Quality
- **Use OpenAI GPT-4o-mini** - Excellent quality, affordable, most reliable

### For Budget-Conscious
- **Use Cohere** - Free tier available, good for structured outputs

### For Complex Tasks
- **Use Anthropic Claude** - Best reasoning capabilities

## Configuration

### Environment Variables

Add to `.env.local`:

```env
# Choose at least one (or multiple for fallback)

# Google Gemini (Recommended for free tier)
GEMINI_API_KEY=your_key_here

# OpenAI GPT
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini  # Optional

# Anthropic Claude
ANTHROPIC_API_KEY=your_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022  # Optional

# Cohere
COHERE_API_KEY=your_key_here
COHERE_MODEL=command  # Optional
```

### Model Selection

You can specify which model to use for each provider:

- **OpenAI**: `gpt-4o-mini`, `gpt-4o`, `gpt-3.5-turbo`
- **Claude**: `claude-3-5-sonnet-20241022`, `claude-3-opus-20240229`, `claude-3-haiku-20240307`
- **Cohere**: `command`, `command-light`, `command-nightly`

## Troubleshooting

### "No AI provider configured"
- Add at least one API key to `.env.local`
- Restart dev server after adding keys

### "API key invalid"
- Verify key is correct (no extra spaces)
- Check if key is active in provider dashboard
- For OpenAI/Claude: Ensure payment method is added

### "Rate limit exceeded"
- Wait a few minutes and try again
- Consider upgrading your plan
- Use a different provider as fallback

### Provider-specific Issues

**OpenAI:**
- Requires paid account
- Check billing status
- Verify API key permissions

**Claude:**
- Requires paid account
- Check API access in dashboard
- Verify model name is correct

**Cohere:**
- Free tier has limits
- Check usage in dashboard
- Consider upgrading if needed

## Cost Estimates

For typical usage (100 discovery runs/month):

- **Gemini**: Free (within limits)
- **OpenAI GPT-4o-mini**: ~$1-3/month
- **Claude**: ~$2-5/month
- **Cohere**: Free (within limits) or ~$1-2/month

## Best Practices

1. **Start with Gemini** - Free and works great
2. **Add OpenAI as backup** - For when you need guaranteed quality
3. **Monitor usage** - Check provider dashboards regularly
4. **Set budgets** - Configure spending limits in provider dashboards
5. **Use fallbacks** - Configure multiple providers for reliability

## Support

For issues with specific providers:
- Check provider documentation
- Review error messages in browser console
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for general issues

